"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup';

export default function EmailEditor() {
  const [prompt, setPrompt] = useState("");
  const [,setGeneratedHtml] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const params = useParams();
  const emailId = params.id as string;
  const [editableHtml, setEditableHtml] = useState("");
  const [subject, setSubject] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const htmlEditorRef = useRef<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (emailId && emailId !== "new") {
      fetchExistingEmail();
    }
  }, [emailId]);

  const fetchExistingEmail = async () => {
    try {
      const response = await fetch(`/api/emails/${emailId}`);
      if (response.ok) {
        const emailData = await response.json();
        setGeneratedHtml(emailData.content);
        setEditableHtml(emailData.content);
        setPrompt(emailData.prompt || "Suggest changes to the email here...");
        setSubject(emailData.subject || "");
      } else {
        console.error("Failed to fetch email");
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  const generateEmail = async () => {
    setIsGenerating(true);
    try {
      const creditAmount = model === "gpt-4o-mini" ? 0.5 : 1;
      
      // Deduct credit before generating email
      const creditResponse = await fetch("/api/deduct-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creditAmount }),
      });
  
      if (!creditResponse.ok) {
        const errorText = await creditResponse.text();
        console.error("Credit deduction error response:", errorText);
        throw new Error(`Failed to deduct credit: ${creditResponse.status}`);
      }
  
      const creditData = await creditResponse.json();
      if (creditData.error) {
        throw new Error(creditData.error);
      }
  
      const apiEndpoint = model === "claude-3-5-sonnet-20240620" ? "/api/claude" : "/api/openai";
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, existingHtml: editableHtml, subject, model }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`Failed to generate email: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      setGeneratedHtml(data.content);
      setEditableHtml(data.content);
  
      // Automatically save only if it's a new email
      if (emailId === "new") {
        await saveEmailToDatabase(data.content);
        toast.success("Email generated and saved successfully");
      } else {
        toast.success("Email generated. Click 'Save Changes' to update.");
      }
    } catch (error) {
      console.error("Error generating email:", error);
      toast.error("Failed to generate email: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

  const saveEmailToDatabase = async (content: string) => {
    try {
      const method = emailId && emailId !== "new" ? "PUT" : "POST";
      const url = emailId && emailId !== "new" ? `/api/emails/${emailId}` : "/api/emails";
  
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject,
          content: editableHtml,
          prompt: prompt,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save email");
      }
  
      const savedEmail = await response.json();
      
      // Update the emailId if it's a new email
      if (emailId === "new") {
        window.history.replaceState({}, "", `/editor/${savedEmail.id}`);
      }
  
      console.log("Email saved successfully", content);
      toast.success("Changes Saved");
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  // const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setEditableHtml(e.target.value);
  // };

  const handlePreviewHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const elementPath = getElementPath(target);
    highlightCodeInEditor(elementPath);
  };

  const getElementPath = (element: HTMLElement): string => {
    const path: string[] = [];
    let currentElement: HTMLElement | null = element;
  
    while (currentElement && currentElement !== previewRef.current) {
      let selector = currentElement.tagName.toLowerCase();
      if (currentElement.id) {
        selector += `#${currentElement.id}`;
      } else if (currentElement.className) {
        selector += `.${currentElement.className.split(' ').join('.')}`;
      }
      path.unshift(selector);
      currentElement = currentElement.parentElement;
    }
  
    return path.join(' > ');
  };

  const highlightCodeInEditor = (elementPath: string) => {
    if (!htmlEditorRef.current) return;
  
    const editorContent = editableHtml;
    const lines = editorContent.split('\n');
    let targetLine = -1;
  
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(elementPath.split(' > ').pop() || '')) {
        targetLine = i;
        break;
      }
    }
  
    if (targetLine !== -1) {
      // Calculate the position to scroll to
      const lineHeight = 20; // Adjust this value based on your editor's line height
      const scrollTop = targetLine * lineHeight;
  
      // Scroll the editor container
      if (htmlEditorRef.current) {
        htmlEditorRef.current.scrollTop = scrollTop;
      }
  
      // Log the highlighted line (since we can't actually highlight it in this editor)
      console.log(`Highlighted line: ${targetLine + 1}`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="p-4 bg-gray-100 border-b">
        <input
          type="text"
          placeholder="Enter email subject..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex-grow grid grid-cols-2 gap-4 p-4">
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-2">HTML Editor</h2>
        <p className="text-sm text-gray-500 mb-2">You can directly edit the HTML content here.</p>
        <Editor
          value={editableHtml}
          onValueChange={(code) => setEditableHtml(code)}
          highlight={code => highlight(code, languages.markup)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            height: '100%',
            overflow: 'auto',
          }}
          className="flex-grow resize-none custom-scrollbar"
          textareaId="codeArea"
          ref={htmlEditorRef}
        />
      </div>
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
        <p className="text-sm text-gray-500 mb-2">You can preview the email here.</p>
        <div 
          ref={previewRef}
          className="flex-grow border p-4 overflow-auto bg-white custom-scrollbar"
          onMouseOver = {handlePreviewHover}>
          <div className="email-preview" dangerouslySetInnerHTML={{ __html: editableHtml }} />
        </div>
      </div>
      </div>
      <div className="p-4 bg-gray-100 border-t">
        <div className="max-w-3xl mx-auto">
          <Textarea
            placeholder="Enter your email prompt here..."
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            rows={3}
            className="w-full mb-2 rounded-lg resize-none custom-scrollbar"
          />
          <div className="flex space-x-2">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o-mini (0.5 credits)</SelectItem>
                <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (1 credit)</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateEmail} disabled={isGenerating} className="flex-1 rounded-lg">
              {isGenerating ? "Generating..." : emailId === "new" ? "Generate & Save Email" : "Edit with AI"}
            </Button>
            <Button onClick={() => saveEmailToDatabase(editableHtml)} className="flex-1 rounded-lg">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
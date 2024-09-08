"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import toast from 'react-hot-toast';

export default function EmailEditor() {
  const [prompt, setPrompt] = useState("");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { userId } = useAuth();
  const params = useParams();
  const emailId = params.id as string;
  const [editableHtml, setEditableHtml] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState("");

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
        // Keep the original prompt if available, otherwise use a default message
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
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, existingHtml: editableHtml, subject }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate email");
      }
  
      const data = await response.json();
      setGeneratedHtml(data.content);
      setEditableHtml(data.content);
  
      // Update the existing email or create a new one
      await saveEmailToDatabase(data.content);
  
    } catch (error) {
      console.error("Error generating email:", error);
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
  
      console.log("Email saved successfully");
      toast.success("Changes Saved");
    } catch (error) {
      console.error("Error saving email:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableHtml(e.target.value);
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
      <div className="flex-grow overflow-hidden grid grid-cols-2 gap-4 p-4">
        <div className="overflow-auto custom-scrollbar">
          <h2 className="text-xl font-semibold mb-2">HTML Editor</h2>
          <Textarea
            value={editableHtml}
            onChange={handleHtmlChange}
            className="w-full h-[calc(100%-2rem)] resize-none custom-scrollbar"
          />
        </div>
        <div className="overflow-auto custom-scrollbar">
          <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
          <div
            className="border p-4 h-[calc(100%-2rem)] overflow-auto bg-white custom-scrollbar"
            dangerouslySetInnerHTML={{ __html: editableHtml }}
          />
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
            <Button onClick={generateEmail} disabled={isGenerating} className="flex-1 rounded-lg">
              {isGenerating ? "Generating..." : "Generate Email"}
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

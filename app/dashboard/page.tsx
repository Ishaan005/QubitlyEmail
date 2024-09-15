"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface Email {
  id: string;
  subject: string;
  content: string;
  createdAt: string;
}

interface EmailStats {
  totalEmails: number;
  generatedThisWeek: number;
  averageGenerationTime: number;
  credits: number;
}

export default function Dashboard() {
  const { userId } = useAuth();
  const [recentEmails, setRecentEmails] = useState<Email[]>([]);
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchDashboardData = async () => {
    if (userId) {
      try {
        const [emailsResponse, statsResponse] = await Promise.all([
          fetch("/api/emails/recent"),
          fetch("/api/emails/stats")
        ]);
  
        if (emailsResponse.ok && statsResponse.ok) {
          const emailsData = await emailsResponse.json();
          const statsData = await statsResponse.json();
  
          setRecentEmails(emailsData);
          setEmailStats(statsData);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    //TODO: Implement search functionality here
  };

  const handleEditClick = (emailId: string) => {
    window.location.href = `/editor/${emailId}`;
  }
  
  const handleAddCredits = () => {
    router.push('/add-credits');
  };

  const handleDeleteClick = async (emailId: string) => {
    if (window.confirm("Are you sure you want to delete this email template?")) {
      try {
        const response = await fetch(`/api/emails/${emailId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Remove the deleted email from the recentEmails state
          setRecentEmails(recentEmails.filter(email => email.id !== emailId));
        } else {
          console.error("Failed to delete email");
        }
      } catch (error) {
        console.error("Error deleting email:", error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Email Generator Dashboard</h1>
      
      <div className="mb-8">
      <Button size="lg" className="mr-4" onClick={() => router.push('/editor/new')}>
          Create New Email
      </Button>
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-xs inline-block"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div className="bg-card p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Total Emails</h3>
      <p className="text-2xl">{emailStats?.totalEmails || 0}</p>
    </div>
    <div className="bg-card p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Generated This Week</h3>
      <p className="text-2xl">{emailStats?.generatedThisWeek || 0}</p>
    </div>
    <div className="bg-card p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Avg. Generation Time</h3>
      <p className="text-2xl">{emailStats?.averageGenerationTime || 0}s</p>
    </div>
    <div className="bg-card p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Credits</h3>
      <p className="text-2xl">{emailStats?.credits.toFixed(1) || 0}</p>
      <Button onClick={handleAddCredits} className="mt-2">Add Credits</Button>
    </div>
  </div>

      {recentEmails.length > 0 ? (
        <ul className="space-y-4">
          {recentEmails.map((email) => (
            <li key={email.id} className="bg-card p-4 rounded-lg shadow">
              <h3 className="font-bold">{email.subject}</h3>
              <p className="text-sm text-muted-foreground">{new Date(email.createdAt).toLocaleDateString()}</p>
              <div className="mt-2 space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(email.id)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(email.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent emails found.</p>
      )}
      <div className="fixed bottom-4 right-4">
        <Button variant="outline" size="sm" asChild>
          <a href="/feedback">Feedback & Support</a>
        </Button>
      </div>
    </div>
  );
}
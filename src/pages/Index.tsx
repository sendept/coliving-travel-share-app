
import { useState, useEffect } from "react";
import { ChatInput } from "@/components/ChatInput";
import { TravelTable, type TravelEntry, type Project } from "@/components/travel-table/TravelTable";
import { PageHeader } from "@/components/PageHeader";
import { parseMessage } from "@/lib/parser";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("default");
  const { toast } = useToast();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error loading projects",
          description: "Could not load projects",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setProjects(data);
      }
    };

    fetchProjects();
  }, [toast]);

  // Fetch entries for selected project
  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('travel_entries')
        .select('*')
        .eq('project_id', selectedProject)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching entries:', error);
        toast({
          title: "Error loading entries",
          description: "Could not load travel entries",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setEntries(data);
      }
    };

    fetchEntries();

    // Subscribe to real-time updates for the selected project
    const channel = supabase
      .channel('public:travel_entries')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_entries',
          filter: `project_id=eq.${selectedProject}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          if (payload.eventType === 'INSERT') {
            setEntries((prev) => [payload.new as TravelEntry, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setEntries((prev) =>
              prev.map((entry) =>
                entry.id === payload.new.id ? (payload.new as TravelEntry) : entry
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedProject, toast]);

  const handleSubmit = async (message: string) => {
    const parsed = parseMessage(message);
    if (!parsed) {
      toast({
        title: "Could not parse message",
        description: "Please try rephrasing your travel plan",
        variant: "destructive",
      });
      return;
    }

    const newEntry = {
      name: parsed.name,
      available_spots: parsed.availableSpots,
      route: parsed.route,
      transport: parsed.transport,
      taxi_sharing: parsed.taxiSharing,
      contact: parsed.contact,
      claimed_by: [],
      language: 'en',
      project_id: selectedProject,
    };

    const { error } = await supabase
      .from('travel_entries')
      .insert([newEntry]);

    if (error) {
      console.error('Error inserting entry:', error);
      toast({
        title: "Error adding travel plan",
        description: "Could not save your travel plan",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Travel plan added!",
      description: "Your travel plan has been successfully added to the list.",
    });
  };

  const handleClaimSpot = async (id: string, name: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    const { error } = await supabase
      .from('travel_entries')
      .update({
        available_spots: entry.available_spots - 1,
        claimed_by: [...entry.claimed_by, name],
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating entry:', error);
      toast({
        title: "Error claiming spot",
        description: "Could not claim the spot",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Spot claimed!",
      description: `${name} has successfully claimed a spot.`,
    });
  };

  return (
    <div className="container py-8 space-y-8">
      <PageHeader />
      
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="project-select" className="text-sm font-medium">
            Select Project:
          </label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ChatInput onSubmit={handleSubmit} />
      </div>

      <div className="overflow-x-auto">
        <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
      </div>
    </div>
  );
};

export default Index;

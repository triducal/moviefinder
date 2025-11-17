import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, MessageSquare, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileDialog from "@/components/EditProfileDialog";

const Profile = () => {
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Header */}
      <div className="p-6 space-y-4">
        {/* Avatar */}
        <div className="flex justify-center">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              JD
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">John Doe</h1>
          <p className="text-sm text-muted-foreground">@johndoe</p>
        </div>

        {/* Edit Profile Button */}
        <Button 
          onClick={() => setEditDialogOpen(true)}
          className="w-full bg-background border border-border text-foreground hover:bg-accent"
        >
          Edit Profile
        </Button>
      </div>

      {/* My Lists Section */}
      <div className="px-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">My Lists</h2>
        
        <button className="w-full bg-card rounded-lg p-4 flex items-center justify-between hover:bg-accent transition-colors">
          <div className="text-left">
            <p className="text-foreground font-medium">List Name</p>
            <p className="text-sm text-muted-foreground">2 other lists</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="flex justify-center gap-4 pt-2">
          <button className="p-2 rounded-full bg-card hover:bg-accent transition-colors">
            <div className="h-8 w-8" />
          </button>
          <button className="p-2 rounded-full bg-card hover:bg-accent transition-colors">
            <div className="h-8 w-8" />
          </button>
          <button className="p-2 rounded-full bg-card hover:bg-accent transition-colors">
            <div className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-6 w-6" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-6 w-6" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MessageSquare className="h-6 w-6" />
          </button>
          <button className="text-primary">
            <User className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </div>
  );
};

export default Profile;

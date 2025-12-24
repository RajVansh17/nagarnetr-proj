import { Search, MapPin, Clock, User, X } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Issue {
  id: string;
  image: string;
  type: string;
  location: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  urgency: 'Low' | 'Medium' | 'High';
  date: string;
  reportedBy: string; // Added field to track who reported
}

const mockIssues: Issue[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1765300013135-e047e42de2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwaW5mcmFzdHJ1Y3R1cmUlMjBwb3Rob2xlfGVufDF8fHx8MTc2NjQ5ODI1MXww&ixlib=rb-4.1.0&q=80&w=400',
    type: 'Pothole',
    location: 'Main Street, Downtown',
    status: 'In Progress',
    urgency: 'High',
    date: '2 days ago',
    reportedBy: 'citizen@demo.com',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1580767114670-c778cc443675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJiYWdlJTIwd2FzdGUlMjBzdHJlZXR8ZW58MXx8fHwxNzY2NTYwMTQyfDA&ixlib=rb-4.1.0&q=80&w=400',
    type: 'Garbage Accumulation',
    location: 'Park Avenue, Sector 3',
    status: 'Pending',
    urgency: 'Medium',
    date: '1 day ago',
    reportedBy: 'citizen@demo.com',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1685992830281-2eef1f9bd3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBzdHJlZXRsaWdodCUyMG5pZ2h0fGVufDF8fHx8MTc2NjU2MDE0Mnww&ixlib=rb-4.1.0&q=80&w=400',
    type: 'Broken Streetlight',
    location: 'Elm Street, Northside',
    status: 'Resolved',
    urgency: 'High',
    date: '5 days ago',
    reportedBy: 'citizen@demo.com',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1613894811137-b5ee44ba3cb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFmZml0aSUyMHdhbGwlMjB1cmJhbnxlbnwxfHx8fDE3NjY1NjAxNDJ8MA&ixlib=rb-4.1.0&q=80&w=400',
    type: 'Graffiti',
    location: 'City Hall Building',
    status: 'Pending',
    urgency: 'Low',
    date: '3 days ago',
    reportedBy: 'john.doe@email.com',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1759803612770-0330d9081176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW1hZ2VkJTIwcm9hZCUyMGNvbnN0cnVjdGlvbnxlbnwxfHx8fDE3NjY1NjAxNDN8MA&ixlib=rb-4.1.0&q=80&w=400',
    type: 'Damaged Road',
    location: 'Highway 42, Exit 12',
    status: 'In Progress',
    urgency: 'High',
    date: '4 days ago',
    reportedBy: 'jane.smith@email.com',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1580767114670-c778cc443675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJiYWdlJTIwd2FzdGUlMjBzdHJlZXR8ZW58MXx8fHwxNzY2NTYwMTQyfDA&ixlib=rb-4.1.0&q=80&w=400',
    type: 'Illegal Dumping',
    location: 'River Road, West End',
    status: 'Resolved',
    urgency: 'Medium',
    date: '1 week ago',
    reportedBy: 'mike.brown@email.com',
  },
];

interface TrackIssuesPageProps {
  userEmail?: string;
  userRole?: 'citizen' | 'admin';
}

export function TrackIssuesPage({ userEmail, userRole = 'citizen' }: TrackIssuesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Filter issues based on user role
  const userIssues = userRole === 'citizen' 
    ? mockIssues.filter(issue => issue.reportedBy === userEmail)
    : mockIssues;

  const filteredIssues = userIssues.filter((issue) => {
    const matchesSearch =
      issue.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Pending':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">
            {userRole === 'citizen' ? 'My Reported Issues' : 'Track Civic Issues'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'citizen' 
              ? 'Monitor the status of issues you have reported' 
              : 'Monitor the status of all reported issues in your area'}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by issue type or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl text-blue-600 mb-2">{userIssues.length}</div>
            <div className="text-gray-600">
              {userRole === 'citizen' ? 'My Issues' : 'Total Issues'}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl text-yellow-600 mb-2">
              {userIssues.filter((i) => i.status === 'Pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl text-green-600 mb-2">
              {userIssues.filter((i) => i.status === 'Resolved').length}
            </div>
            <div className="text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Issue Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Issue Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={issue.image}
                  alt={issue.type}
                  className="w-full h-full object-cover"
                />
                {/* Urgency Indicator */}
                <div className="absolute top-3 left-3">
                  <div className={`${getUrgencyColor(issue.urgency)} text-white px-3 py-1 rounded-full text-xs`}>
                    {issue.urgency} Priority
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-gray-900">{issue.type}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{issue.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Reported {issue.date}</span>
                  </div>
                  {userRole === 'admin' && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="truncate">{issue.reportedBy}</span>
                    </div>
                  )}
                </div>

                <button className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setSelectedIssue(issue)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {userRole === 'citizen' 
                ? "You haven't reported any issues yet. Start by reporting your first issue!" 
                : 'No issues found matching your criteria'}
            </p>
          </div>
        )}
      </div>

      {/* Issue Details Dialog */}
      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-6">
              {/* Issue Image */}
              <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={selectedIssue.image}
                  alt={selectedIssue.type}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <div className={`${getUrgencyColor(selectedIssue.urgency)} text-white px-3 py-1 rounded-full text-xs`}>
                    {selectedIssue.urgency} Priority
                  </div>
                </div>
              </div>

              {/* Issue Information */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-gray-900 mb-1">{selectedIssue.type}</h3>
                    <p className="text-sm text-gray-600">Issue ID: #{selectedIssue.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(selectedIssue.status)}`}>
                    {selectedIssue.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900">{selectedIssue.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Reported</p>
                      <p className="text-gray-900">{selectedIssue.date}</p>
                    </div>
                  </div>

                  {userRole === 'admin' && (
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Reported By</p>
                        <p className="text-gray-900">{selectedIssue.reportedBy}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5">
                      <div className={`w-3 h-3 rounded-full ${getUrgencyColor(selectedIssue.urgency)}`}></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Priority Level</p>
                      <p className="text-gray-900">{selectedIssue.urgency}</p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-3">Status Timeline</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedIssue.status === 'Resolved' || selectedIssue.status === 'In Progress' || selectedIssue.status === 'Pending' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm text-gray-700">Issue Raised</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedIssue.status === 'Resolved' || selectedIssue.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm text-gray-700">Authorities Contacted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedIssue.status === 'Resolved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm text-gray-700">Issue Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
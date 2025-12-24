import { useState } from 'react';
import { Upload, Sparkles, CheckCircle, AlertCircle, Camera, Users } from 'lucide-react';
import { GoogleMapsPicker } from './GoogleMapsPicker';
import { calculateUrgency, analyzeIssueImage } from '../utils/urgencyCalculator';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'admin';
}

interface ReportIssuePageProps {
  user: User;
}

export function ReportIssuePage({ user }: ReportIssuePageProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [detectedIssue, setDetectedIssue] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [urgencyScore, setUrgencyScore] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({
    address: '',
    latitude: 0,
    longitude: 0,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateIssue, setDuplicateIssue] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setIsSubmitted(false);
        // Simulate AI analysis
        simulateAIAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true);
    setIsAnalyzed(false);
    
    setTimeout(() => {
      // Simulate AI detection with urgency calculator
      const issues = [
        'Pothole',
        'Garbage Accumulation',
        'Broken Streetlight',
        'Graffiti',
        'Damaged Road',
        'Blocked Drainage',
        'Traffic Signal Malfunction',
        'Missing Manhole Cover',
      ];
      const randomIssue = issues[Math.floor(Math.random() * issues.length)];
      
      // Simulate image analysis
      const imageAnalysis = analyzeIssueImage('', randomIssue);
      setAiAnalysis(imageAnalysis);
      
      setDetectedIssue(randomIssue);
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 2000);
  };

  const handleLocationSelect = (selectedLocation: {
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setLocation(selectedLocation);
    
    // Calculate urgency when location is selected and issue is detected
    if (detectedIssue && selectedLocation.address) {
      const urgencyResult = calculateUrgency({
        issueType: detectedIssue,
        location: selectedLocation.address,
        description: description,
        imageAnalysis: aiAnalysis,
      });
      
      setUrgencyLevel(urgencyResult.level);
      setUrgencyScore(urgencyResult.score);
      
      // Check for duplicate issues nearby (simulated)
      checkForDuplicates(selectedLocation.latitude, selectedLocation.longitude, detectedIssue);
    }
  };

  const checkForDuplicates = async (lat: number, lng: number, issueType: string) => {
    // Simulate checking for duplicates
    // In real implementation, this would query the backend for nearby similar issues
    const shouldShowDuplicate = Math.random() > 0.6;
    
    if (shouldShowDuplicate) {
      setDuplicateIssue({
        distance: (Math.random() * 0.5).toFixed(2),
        reportedBy: ['Rajesh Kumar', 'Priya Sharma'],
        reportCount: Math.floor(Math.random() * 3) + 2,
      });
    } else {
      setDuplicateIssue(null);
    }
  };

  const handleSubmit = async () => {
    if (!location.address || !detectedIssue) {
      alert('Please ensure all fields are filled');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to backend
      const issueData = {
        type: detectedIssue,
        location: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        description: description || aiAnalysis,
        imageUrl: uploadedImage,
        urgency: urgencyLevel,
        urgencyScore: urgencyScore,
        aiAnalysis: aiAnalysis,
      };

      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Submitted issue:', issueData);
      
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setUploadedImage(null);
        setIsAnalyzed(false);
        setDetectedIssue('');
        setUrgencyLevel('');
        setUrgencyScore(0);
        setAiAnalysis('');
        setDescription('');
        setIsSubmitted(false);
        setDuplicateIssue(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return 'text-red-700 bg-red-50 border-red-300';
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-2">Report a Civic Issue</h1>
          <p className="text-gray-600">Upload a photo and let AI help identify the problem</p>
        </div>

        {isSubmitted ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-green-600 mb-2">Issue Reported Successfully!</h2>
            <p className="text-gray-600">
              Your report has been submitted to local authorities. You can track its status in the Track Issues page.
            </p>
            {duplicateIssue && (
              <div className="mt-4 text-sm text-gray-600">
                Your report was linked with {duplicateIssue.reportCount} similar reports from the area.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8">
            {/* Image Upload Area */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Upload Issue Photo</label>
              {!uploadedImage ? (
                <label className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded issue"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setIsAnalyzed(false);
                      setDetectedIssue('');
                      setUrgencyLevel('');
                      setDuplicateIssue(null);
                    }}
                    className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
                  >
                    Change Photo
                  </button>
                </div>
              )}
            </div>

            {/* AI Analysis Status */}
            {isAnalyzing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                <div>
                  <p className="text-blue-900">AI is analyzing the image...</p>
                  <p className="text-sm text-blue-700">Detecting issue type and severity</p>
                </div>
              </div>
            )}

            {/* AI Detection Results */}
            {isAnalyzed && (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-blue-900 mb-2">
                        AI detected issue: <strong>{detectedIssue}</strong>
                      </p>
                      <p className="text-sm text-gray-600 mb-3">{aiAnalysis}</p>
                      {urgencyLevel && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Calculated Urgency:</span>
                          <span className={`text-sm px-3 py-1 rounded-full border ${getUrgencyColor(urgencyLevel)}`}>
                            {urgencyLevel} ({urgencyScore}/100)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {duplicateIssue && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-yellow-900 mb-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        Similar issue found {duplicateIssue.distance} km away
                      </p>
                      <p className="text-sm text-yellow-700 mb-2">
                        This issue has been reported by {duplicateIssue.reportCount} citizens including:{' '}
                        <strong>{duplicateIssue.reportedBy.join(', ')}</strong>
                      </p>
                      <p className="text-xs text-yellow-600">
                        Your report will be linked to increase priority and help authorities address it faster.
                      </p>
                    </div>
                  </div>
                )}

                {/* Issue Type (Read-only) */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Issue Type</label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-700 flex items-center justify-between">
                    <span>{detectedIssue}</span>
                    <span className="text-xs text-gray-500">Auto-detected by AI</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Additional Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any additional details about the issue..."
                    className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Google Maps Location Picker */}
                <div className="mb-6">
                  <GoogleMapsPicker onLocationSelect={handleLocationSelect} />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!location.address || isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      Submit Issue Report
                    </>
                  )}
                </button>
              </>
            )}

            {/* Helper Text */}
            {!uploadedImage && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>How it works:</strong>
                </p>
                <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
                  <li>Upload a photo of the civic issue</li>
                  <li>AI will automatically detect the issue type and severity</li>
                  <li>Select the exact location on the map</li>
                  <li>Add optional details and submit</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

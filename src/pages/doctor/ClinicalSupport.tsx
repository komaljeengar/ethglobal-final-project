import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  MessageSquare,
  Send,
  Search,
  Filter,
  Calendar,
  Plus,
  Eye,
  Download,
  Share,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Stethoscope,
  Activity,
  Shield,
  User,
  Building,
  Globe,
  Zap,
  ChevronRight,
  Target,
  Network,
  DollarSign,
  TrendingUp,
  TrendingDown,
  InfoIcon,
  ArrowUpRight,
  Landmark,
  Wallet,
  Coins,
  Truck,
  Home,
  Car,
  Bell,
  Settings,
  RefreshCw,
  Bot,
  Sparkles,
  Lightbulb,
  BookOpen,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Edit,
  Save,
  X,
  Users,
  UserPlus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

const ClinicalSupport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRefreshed, setShowRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "ai",
      content:
        "Hello Dr. Smith! I'm your AI Clinical Assistant. I can help you with diagnosis support, treatment recommendations, drug interactions, and medical research. How can I assist you today?",
      timestamp: "2024-01-22 10:30 AM",
      helpful: true,
    },
    {
      id: "2",
      type: "user",
      content:
        "I have a patient with chest pain and elevated troponin levels. What should I consider?",
      timestamp: "2024-01-22 10:32 AM",
    },
    {
      id: "3",
      type: "ai",
      content:
        "Based on the symptoms you've described, this could indicate acute coronary syndrome. I recommend:\n\n1. **Immediate Assessment**: ECG, cardiac enzymes, chest X-ray\n2. **Differential Diagnosis**: Consider MI, unstable angina, aortic dissection\n3. **Treatment Protocol**: Aspirin, statin, beta-blocker if no contraindications\n4. **Monitoring**: Continuous cardiac monitoring, serial troponins\n\nWould you like me to provide specific treatment protocols or drug interaction checks?",
      timestamp: "2024-01-22 10:33 AM",
      helpful: true,
    },
  ]);

  const clinicalTools = [
    {
      id: "1",
      name: "Drug Interaction Checker",
      description:
        "Check for potential drug interactions and contraindications",
      icon: <Shield className="h-6 w-6" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      id: "2",
      name: "Diagnosis Assistant",
      description: "AI-powered differential diagnosis support",
      icon: <Brain className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "3",
      name: "Treatment Protocols",
      description: "Evidence-based treatment recommendations",
      icon: <BookOpen className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "4",
      name: "Medical Literature",
      description: "Latest research and clinical guidelines",
      icon: <FileText className="h-6 w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  const quickQuestions = [
    {
      id: "1",
      question: "Check drug interactions for Lisinopril and Metformin",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "2",
      question: "Differential diagnosis for chest pain",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      id: "3",
      question: "Treatment protocol for hypertension",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: "4",
      question: "Latest guidelines for diabetes management",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  const clinicalInsights = [
    {
      id: "1",
      title: "Patient Risk Assessment",
      description:
        "AI analysis suggests high cardiovascular risk based on patient history and lab values.",
      type: "warning",
      action: "Review treatment plan",
      value: "High Risk",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      id: "2",
      title: "Drug Interaction Alert",
      description:
        "Potential interaction between prescribed medications detected.",
      type: "alert",
      action: "Review medication list",
      value: "Interaction",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      id: "3",
      title: "Treatment Optimization",
      description: "AI suggests dosage adjustment based on patient response.",
      type: "suggestion",
      action: "Consider adjustment",
      value: "Optimize",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowRefreshed(true);
    setTimeout(() => setShowRefreshed(false), 3000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: "user",
        content: message,
        timestamp: new Date().toLocaleString(),
      };
      setMessages([...messages, newMessage]);
      setMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            "I understand your clinical question. Let me analyze the medical data and provide evidence-based recommendations...",
          timestamp: new Date().toLocaleString(),
          helpful: true,
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 text-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Clinical Support</h1>
              <p className="text-purple-100">
                Advanced AI assistance for clinical decision making and patient
                care
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30">
                <Brain className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Sync Data
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-green-300" />
                <span className="text-sm text-purple-100">
                  Clinical Sessions
                </span>
              </div>
              <div className="text-2xl font-bold">24</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-blue-300" />
                <span className="text-sm text-purple-100">AI Insights</span>
              </div>
              <div className="text-2xl font-bold">18</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-sm text-purple-100">Accuracy Rate</span>
              </div>
              <div className="text-2xl font-bold">96%</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-sm text-purple-100">Time Saved</span>
              </div>
              <div className="text-2xl font-bold">2.5h</div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showRefreshed && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">
                    Clinical Support Updated!
                  </h3>
                  <p className="text-green-700 text-sm">
                    AI clinical assistant has been updated with the latest
                    medical data and guidelines.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Clinical Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Clinical Tools
            </CardTitle>
            <CardDescription>
              AI-powered tools to enhance your clinical practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clinicalTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-start gap-3 ${tool.bgColor} ${tool.borderColor} border hover:shadow-lg transition-all duration-300`}
                >
                  <div
                    className={`${tool.color} ${tool.bgColor} p-2 rounded-lg`}
                  >
                    {tool.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{tool.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {tool.description}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Quick Clinical Questions
            </CardTitle>
            <CardDescription>
              Common clinical scenarios you can ask your AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickQuestions.map((question) => (
                <Button
                  key={question.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={() => handleQuickQuestion(question.question)}
                >
                  <div className="flex items-center gap-2">
                    {question.icon}
                    <span className="font-medium">{question.question}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface and Clinical Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="xl:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Clinical AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {msg.type === "ai" && (
                            <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">
                              {msg.content}
                            </p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp}
                            </p>
                            {msg.type === "ai" && (
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask your clinical AI assistant..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clinical Insights Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Clinical Insights
                </CardTitle>
                <CardDescription>
                  AI-powered clinical recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clinicalInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge
                          className={`${insight.bgColor} ${insight.color} border-0`}
                        >
                          {insight.value}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {insight.description}
                      </p>
                      <Button variant="link" className="p-0 text-xs h-auto">
                        {insight.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Clinical Guidelines
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Drug Interactions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="h-4 w-4 mr-2" />
                    Diagnosis Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Medical Literature
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClinicalSupport;

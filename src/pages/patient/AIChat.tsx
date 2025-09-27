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
  EyeOff,
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
  Download,
  Share,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

const AIChat = () => {
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
        "Hello! I'm your AI Health Assistant. I can help you understand your medical records, provide health insights, and answer questions about your health. How can I assist you today?",
      timestamp: "2024-01-22 10:30 AM",
      helpful: true,
    },
    {
      id: "2",
      type: "user",
      content: "Can you explain my recent blood test results?",
      timestamp: "2024-01-22 10:32 AM",
    },
    {
      id: "3",
      type: "ai",
      content:
        "Based on your recent blood test from January 20th, your results show:\n\n• **Complete Blood Count**: All values within normal range\n• **Lipid Panel**: Total cholesterol 180 mg/dL (normal), HDL 45 mg/dL (good), LDL 110 mg/dL (optimal)\n• **Metabolic Panel**: Glucose 95 mg/dL (normal), kidney function markers all normal\n\nOverall, your results indicate good health with no concerning values. Your cholesterol levels are well-managed, and your metabolic markers are healthy.",
      timestamp: "2024-01-22 10:33 AM",
      helpful: true,
    },
  ]);

  const quickQuestions = [
    {
      id: "1",
      question: "Explain my recent lab results",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "2",
      question: "What medications am I taking?",
      icon: <Stethoscope className="h-4 w-4" />,
    },
    {
      id: "3",
      question: "Schedule my next appointment",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "4",
      question: "Health tips for my condition",
      icon: <Lightbulb className="h-4 w-4" />,
    },
  ];

  const healthInsights = [
    {
      id: "1",
      title: "Blood Pressure Trend",
      description:
        "Your blood pressure has improved by 8% over the last 3 months.",
      type: "improvement",
      action: "Continue current medication regimen",
      value: "+8%",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "2",
      title: "Medication Reminder",
      description:
        "Consider discussing vitamin D supplementation with Dr. Rodriguez.",
      type: "suggestion",
      action: "Schedule consultation",
      value: "Due Soon",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "3",
      title: "Lab Follow-up",
      description:
        "Your cholesterol levels need monitoring. Next test due in 2 weeks.",
      type: "reminder",
      action: "Book lab appointment",
      value: "2 weeks",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
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
            "I understand your question. Let me analyze your medical records to provide you with the most accurate information...",
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
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Health Assistant</h1>
              <p className="text-purple-100">
                Get personalized health insights and answers to your medical
                questions
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
                <span className="text-sm text-purple-100">Chat Sessions</span>
              </div>
              <div className="text-2xl font-bold">12</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-blue-300" />
                <span className="text-sm text-purple-100">AI Insights</span>
              </div>
              <div className="text-2xl font-bold">8</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-sm text-purple-100">
                  Helpful Responses
                </span>
              </div>
              <div className="text-2xl font-bold">95%</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-sm text-purple-100">Accuracy</span>
              </div>
              <div className="text-2xl font-bold">98%</div>
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
                    AI Assistant Updated!
                  </h3>
                  <p className="text-green-700 text-sm">
                    Your AI assistant has been updated with the latest medical
                    data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Questions */}
        <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Lightbulb className="h-5 w-5 text-purple-600" />
              Quick Questions
            </CardTitle>
            <CardDescription>
              Common questions you can ask your AI health assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickQuestions.map((question) => (
                <Button
                  key={question.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400 transition-all duration-300"
                  onClick={() => handleQuickQuestion(question.question)}
                >
                  <div className="flex items-center gap-2 justify-center">
                    {question.icon}
                    <span className="font-medium text-black text-center">
                      {question.question}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Messages */}
          <div className="lg:col-span-2">
            <Card className="min-h-[500px] max-h-[800px] sm:min-h-[600px] sm:max-h-[900px] flex flex-col bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Bot className="h-5 w-5 text-purple-600" />
                  Chat with AI
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 p-6 pb-4 min-h-0">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] p-3 rounded-lg ${
                          msg.type === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-gradient-to-r from-purple-50 to-indigo-50 text-gray-900 border border-purple-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {msg.type === "ai" && (
                            <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-purple-600" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm whitespace-pre-wrap break-words">
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
                                  className="h-6 px-2 text-purple-600 hover:bg-purple-100"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-purple-600 hover:bg-purple-100"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-purple-600 hover:bg-purple-100"
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

                {/* Message Input - Fixed at bottom */}
                <div className="flex-shrink-0 flex gap-2 w-full flex-col sm:flex-row p-6 pt-4 border-t border-purple-200 bg-white">
                  <Input
                    placeholder="Ask your AI health assistant..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200 min-w-0"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-900 disabled:text-gray-900 w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Insights Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Health Insights
                </CardTitle>
                <CardDescription>
                  Personalized health recommendations from AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-black">
                          {insight.title}
                        </h4>
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                          {insight.value}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {insight.description}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 text-xs h-auto text-purple-600 hover:text-purple-700"
                      >
                        {insight.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400 transition-all duration-300"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Health Knowledge Base
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400 transition-all duration-300"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Medical Records Summary
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400 transition-all duration-300"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Consultation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400 transition-all duration-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Chat History
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

export default AIChat;

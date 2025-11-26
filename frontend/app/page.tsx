"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toast } from "@/components/ui/toast";
import {
  Loader2,
  Target,
  CheckCircle2,
  Sparkles,
  Trash2,
  List,
  Plus,
  X,
  Clock,
  TrendingUp,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  order: number;
  created_at: string;
}

interface Goal {
  id: string;
  title: string;
  complexity_score: number;
  created_at: string;
  tasks: Task[];
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://smart-goal-breaker-h0i2.onrender.com";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Goal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allGoals, setAllGoals] = useState<Goal[]>([]);
  const [showAllGoals, setShowAllGoals] = useState(false);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Load all goals on mount
  useEffect(() => {
    loadAllGoals();
  }, []);

  const loadAllGoals = async () => {
    setLoadingGoals(true);
    try {
      const response = await fetch(`${API_URL}/goals`);
      if (response.ok) {
        const data = await response.json();
        setAllGoals(data);
      }
    } catch (err) {
      console.error("Failed to load goals:", err);
    } finally {
      setLoadingGoals(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError("Please enter a goal");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: goal.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to break down goal");
      }

      const data: Goal = await response.json();
      setResult(data);
      setGoal("");
      setShowAllGoals(false);
      setToast({ message: "🎉 Goal broken down successfully!", type: "success" });
      await loadAllGoals(); // Refresh goals list
      // Scroll to result
      setTimeout(() => {
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      // Note: Backend doesn't have delete endpoint, but we can remove from local state
      setAllGoals(allGoals.filter((g) => g.id !== goalId));
      if (result?.id === goalId) {
        setResult(null);
      }
      setToast({ message: "Goal removed from view", type: "info" });
    } catch (err) {
      setToast({ message: "Failed to delete goal", type: "error" });
    }
  };

  const getComplexityColor = (score: number) => {
    if (score <= 3) return "bg-emerald-500 hover:bg-emerald-600";
    if (score <= 6) return "bg-amber-500 hover:bg-amber-600";
    return "bg-rose-500 hover:bg-rose-600";
  };

  const getComplexityLabel = (score: number) => {
    if (score <= 3) return "Easy";
    if (score <= 6) return "Medium";
    return "Hard";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayGoals = showAllGoals ? allGoals : (result ? [result] : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Target className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 dark:text-indigo-400" />
              <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Smart Goal Breaker
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your vague goals into actionable steps with AI-powered planning
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Powered by Gemini AI</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-start sm:items-center">
          <Button
            variant="outline"
            onClick={() => {
              setShowAllGoals(!showAllGoals);
              setResult(null);
            }}
            className="w-full sm:w-auto"
          >
            {showAllGoals ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create New Goal
              </>
            ) : (
              <>
                <List className="mr-2 h-4 w-4" />
                View All Goals ({allGoals.length})
              </>
            )}
          </Button>
        </div>

        {/* Input Form */}
        {!showAllGoals && (
          <Card className="mb-8 shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Enter Your Goal
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Type any goal you want to achieve, and we'll break it down into 5
                actionable steps using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., Launch a startup, Learn Spanish, Get fit..."
                    value={goal}
                    onChange={(e) => {
                      setGoal(e.target.value);
                      setError(null);
                    }}
                    disabled={loading}
                    className="flex-1 h-11 sm:h-12 text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) {
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !goal.trim()}
                    className="h-11 sm:h-12 px-6 sm:px-8 bg-indigo-600 hover:bg-indigo-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Breaking Down...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Break Down
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </form>

              {/* Example Goals */}
              {!result && !loading && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    💡 Try one of these examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Launch a startup",
                      "Learn a new language",
                      "Get fit and healthy",
                      "Build a mobile app",
                      "Write a book",
                      "Start a YouTube channel",
                    ].map((example) => (
                      <Button
                        key={example}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGoal(example);
                          setError(null);
                        }}
                        className="text-xs sm:text-sm"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results - Single Goal View */}
        {result && !showAllGoals && (
          <div id="result" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="shadow-xl border-2 border-indigo-100 dark:border-indigo-900">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl mb-3 pr-8">
                      {result.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        className={`${getComplexityColor(
                          result.complexity_score
                        )} text-white font-semibold px-3 py-1`}
                      >
                        Complexity: {result.complexity_score.toFixed(1)}/10 -{" "}
                        {getComplexityLabel(result.complexity_score)}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(result.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    Your Action Plan:
                  </h3>
                  {result.tasks
                    .sort((a, b) => a.order - b.order)
                    .map((task, index) => (
                      <div
                        key={task.id}
                        className="group flex gap-4 p-4 rounded-lg border border-border hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-md">
                            {task.order}
                          </div>
                        </div>
                        <div className="flex-1 flex items-center">
                          <p className="text-sm sm:text-base leading-relaxed">
                            {task.title}
                          </p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* All Goals View */}
        {showAllGoals && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">All Goals</h2>
              <Badge variant="secondary" className="text-sm">
                {allGoals.length} {allGoals.length === 1 ? "goal" : "goals"}
              </Badge>
            </div>

            {loadingGoals ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : allGoals.length === 0 ? (
              <Card className="py-12 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first goal to get started!
                </p>
                <Button onClick={() => setShowAllGoals(false)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Goal
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allGoals.map((goalItem) => (
                  <Card
                    key={goalItem.id}
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-indigo-200 dark:hover:border-indigo-800"
                    onClick={() => {
                      setResult(goalItem);
                      setShowAllGoals(false);
                      document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base sm:text-lg line-clamp-2 flex-1">
                          {goalItem.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGoal(goalItem.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={`${getComplexityColor(
                            goalItem.complexity_score
                          )} text-white text-xs`}
                        >
                          {goalItem.complexity_score.toFixed(1)}/10
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(goalItem.created_at)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold">{goalItem.tasks.length}</span>{" "}
                        actionable steps
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleDemoMode = async () => {
    setIsLoading(true)
    setError(null)
    setProgress(10)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      // Use the sample transcript
      const response = await fetch("/api/process-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ useDemo: true }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process demo transcript")
      }

      // Navigate to results page with the processed data
      setTimeout(() => {
        router.push(`/results?id=${data.id}`)
      }, 500) // Short delay to show 100% progress
    } catch (error) {
      console.error("Error processing demo transcript:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to process demo transcript"
      setError(errorMessage)
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    setError(null)
    setProgress(10)

    // Create FormData to send the file
    const formData = new FormData()
    formData.append("transcript", file)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const response = await fetch("/api/process-transcript", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process transcript")
      }

      // Navigate to results page with the processed data
      setTimeout(() => {
        router.push(`/results?id=${data.id}`)
      }, 500) // Short delay to show 100% progress
    } catch (error) {
      console.error("Error processing transcript:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to process transcript"
      setError(errorMessage)
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-sm border bg-white">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Upload Transcript</CardTitle>
        <CardDescription>Upload your meeting transcript file (TXT, CSV, JSON)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="transcript" className="text-center font-medium">
              Select Transcript File
            </Label>
            <div className="flex items-center justify-center">
              <div className="relative w-full">
                <Input
                  id="transcript"
                  type="file"
                  accept=".txt,.csv,.json"
                  onChange={handleFileChange}
                  className="cursor-pointer border-dashed text-center py-8 hidden"
                />
                <div className="border border-dashed rounded-md p-6 text-center">
                  <div className="flex flex-col items-center justify-center text-sm text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="mb-1">Drag & drop or click to browse</span>
                    <span className="text-xs">{file ? file.name : "No file chosen"}</span>
                  </div>
                  <label htmlFor="transcript" className="absolute inset-0 cursor-pointer">
                    <span className="sr-only">Choose file</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium truncate">{file.name}</span>
              <span className="text-xs text-gray-500 ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          )}

          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Processing transcript...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button type="submit" disabled={!file || isLoading} className="w-full flex items-center justify-center">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Process Transcript
                </>
              )}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            <Button variant="outline" onClick={handleDemoMode} disabled={isLoading} className="w-full" type="button">
              Try Demo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

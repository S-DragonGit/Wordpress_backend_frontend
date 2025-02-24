"use client"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"

interface RatingQuestionProps {
  question: string
  rating: number
  maxRating: number
  responses: number
}

interface YesNoQuestionProps {
  question: string
  yesPercentage: number
  responses: number
}

const RatingQuestion = ({ question, rating, maxRating, responses }: RatingQuestionProps) => {
  const percentage = (rating / maxRating) * 100

  return (
    <div className="py-6 border-b border-gray-200 last:border-0">
      <h3 className="text-base font-medium text-primary mb-4">{question}</h3>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {rating} out of {maxRating}
        </span>
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-primary-light2">
          <div
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center bg-primary whitespace-nowrap text-white justify-center bg-gray-900"
          />
        </div>
      </div>
      <div className="mt-1 text-right">
        <span className="text-sm text-gray-500">{responses} responses</span>
      </div>
    </div>
  )
}

const YesNoQuestion = ({ question, yesPercentage, responses }: YesNoQuestionProps) => {
  return (
    <div className="py-6 border-b border-gray-200 last:border-0">
      <h3 className="text-base font-medium text-gray-900 mb-4">{question}</h3>
      <div className="flex items-center gap-4 mb-2">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Yes</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">No</span>
          </div>
        </div>
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-primary-light2">
          <div
            style={{ width: `${yesPercentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
          />
        </div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-sm text-gray-500">{responses} responses</span>
        <span className="text-sm text-gray-500">{yesPercentage}% Yes</span>
      </div>
    </div>
  )
}

export default function EventReviews() {
  const [activeTab, setActiveTab] = useState("review")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary rounded-md text-white p-6">
        <h1 className="text-2xl font-semibold mb-1">Survey Results</h1>
        <p className="text-gray-400">View feedback and ratings from event participants</p>
      </div>

      <div className="w-7/8 mx-auto bg-primary-light shadow-sm rounded-lg mt-10 p-6 pt-12">
        <div className="flex bg-gray-900 rounded-t-lg">
          <button
            className={`flex-1 py-4 px-6 text-primary text-center rounded-t-lg transition-colors hover:bg-primary hover:text-white mr-4 ${
              activeTab === "review" ? "bg-primary text-white font-medium" : "bg-primary-light2 hover:text-white hover:bg-primary"
            }`}
            onClick={() => setActiveTab("review")}
          >
            Review Questions
          </button>
          <button
            className={`flex-1 py-4 px-6 text-primary text-center rounded-t-lg transition-colors hover:bg-primary hover:text-white mr-4 ${
              activeTab === "yesno" ? "bg-primary text-white font-medium" : "bg-primary-light2 hover:text-white hover:bg-primary"
            }`}
            onClick={() => setActiveTab("yesno")}
          >
            Yes/No Questions
          </button>
        </div>

        <div className="p-6">
          {activeTab === "review" ? (
            <>
              <RatingQuestion
                question="How would you rate the content of the event?"
                rating={4.4}
                maxRating={5}
                responses={5}
              />
              <RatingQuestion
                question="How would you rate the speaker's presentation?"
                rating={4.4}
                maxRating={5}
                responses={5}
              />
              <RatingQuestion
                question="How would you rate the event organization?"
                rating={4.0}
                maxRating={5}
                responses={5}
              />
            </>
          ) : (
            <>
              <YesNoQuestion
                question="Would you attend similar events in the future?"
                yesPercentage={80}
                responses={5}
              />
              <YesNoQuestion question="Was the event duration appropriate?" yesPercentage={80} responses={5} />
              <YesNoQuestion question="Did the event meet your expectations?" yesPercentage={80} responses={5} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}


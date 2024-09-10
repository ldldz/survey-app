import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Question = {
  Q: string;
  A1: string;
  A2: string;
  A3: string;
};

type SurveyData = Question[];

const sampleSurveyData: SurveyData = [
  { Q: "가장 좋아하는 색은?", A1: "빨강", A2: "파랑", A3: "초록" },
  { Q: "가장 좋아하는 동물은?", A1: "강아지", A2: "고양이", A3: "토끼" },
  { Q: "가장 좋아하는 음식은?", A1: "피자", A2: "햄버거", A3: "파스타" },
];

export default function App() {
  const [userId, setUserId] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      setIsStarted(true);
      setError(null);
    } else {
      setError("사용자 ID를 입력해주세요.");
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleSurveyData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    try {
      const surveyResult = {
        userId,
        answers: answers.map((answer, index) => ({
          question: sampleSurveyData[index].Q,
          answer,
        })),
      };
      /////////////////////////////////////
      // surveyResult를 어떻게 할 것인지???
      console.log(surveyResult);
      setIsSubmitted(true);
    } catch (err) {
      setError("결과 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Error saving survey result:", err);
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>설문조사</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStart}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="userId"
                    placeholder="사용자 ID를 입력하세요"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleStart}>시작하기</Button>
          </CardFooter>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>설문조사 완료</CardTitle>
          </CardHeader>
          <CardContent>
            <p>응답해 주셔서 감사합니다!</p>
            <p>결과가 JSON 파일로 다운로드되었습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = sampleSurveyData[currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>질문 {currentQuestionIndex + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{currentQuestion.Q}</p>
          <div className="space-y-2">
            {["A1", "A2", "A3"].map((key) => (
              <Button
                key={key}
                onClick={() => handleAnswer(currentQuestion[key as keyof Question])}
                variant={
                  answers[currentQuestionIndex] === currentQuestion[key as keyof Question] ? "default" : "outline"
                }
                className="w-full"
              >
                {currentQuestion[key as keyof Question]}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
            이전
          </Button>
          {currentQuestionIndex === sampleSurveyData.length - 1 ? (
            <Button onClick={handleSubmit} variant="default">
              제출
            </Button>
          ) : (
            <Button onClick={handleNext} variant="default">
              다음
            </Button>
          )}
        </CardFooter>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </Card>
    </div>
  );
}

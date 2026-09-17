import { Play, UserPlus, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { dateFormater } from "@/shared/utils";
import TestSessionStatusBadge from "@/components/TestSessionStatusBadge";
import type { TestSessionDto } from "../dtos/test-session.dto";

export type StudentSessionsProps = {
  data: TestSessionDto[];
  loading?: boolean;
  onRegister: (session: TestSessionDto) => void;
  onStart: (session: TestSessionDto) => void;
  onResults: (session: TestSessionDto) => void;
};

export default function StudentSessions({
  data,
  loading,
  onRegister,
  onStart,
  onResults,
}: StudentSessionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {data.map((session) => {
        const started = session.status === "STARTED";
        const finished = session.status === "FINISHED";

        return (
          <Card
            key={session.id}
            className="transition-shadow hover:shadow-lg"
          >
            <CardContent className="flex flex-col gap-3 pt-6">
              <div className="flex items-center justify-between">
                <TestSessionStatusBadge status={session.status} />
                <span className="text-xs text-(--text-muted)">#{session.id}</span>
              </div>

              <div>
                <div className="text-lg font-semibold">{session.test.name}</div>
                <div className="text-sm text-(--text-muted)">
                  Duration: {session.test.period ?? "—"} min
                </div>
              </div>

              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-(--text-muted)">Starts</span>
                  <span>{dateFormater(session.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--text-muted)">Ends</span>
                  <span>{dateFormater(session.finishDate)}</span>
                </div>
              </div>

              <div className="mt-2 flex gap-2">
                {!started && !finished && (
                  <Button
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => onRegister(session)}
                    disabled={loading}
                  >
                    <UserPlus size={16} />
                    Register
                  </Button>
                )}
                {started && (
                  <Button
                    variant="success"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => onStart(session)}
                    disabled={loading}
                  >
                    <Play size={16} />
                    Start
                  </Button>
                )}
                {finished && (
                  <Button
                    variant="outline-info"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => onResults(session)}
                  >
                    <BarChart3 size={16} />
                    View results
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
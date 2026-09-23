import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import QuestionTypeBadge from "./QuestionTypeBadge";
import TestSessionStatusBadge from "./TestSessionStatusBadge";
import StudentTestSessionStatusBadge from "./StudentTestSessionStatusBadge";

describe("RoleBadge", () => {
  it("renders the translated role title", () => {
    const { container } = render(<RoleBadge role="STUDENT" />);

    expect(container).toHaveTextContent("Student");
    expect(container.querySelector("div")?.className).toContain("bg-blue-400");
  });

  it("renders nothing when no role is given", () => {
    const { container } = render(<RoleBadge />);

    expect(container).toHaveTextContent("");
  });
});

describe("StatusBadge", () => {
  it("renders the translated status title", () => {
    const { container } = render(<StatusBadge status="ACTIVE" />);

    expect(container).toHaveTextContent("Active");
  });

  it("renders nothing when no status is given", () => {
    const { container } = render(<StatusBadge />);

    expect(container).toHaveTextContent("");
  });
});

describe("QuestionTypeBadge", () => {
  it("renders the translated question type", () => {
    const { container } = render(<QuestionTypeBadge type="DRAG_DROP" />);

    expect(container).toHaveTextContent("Drag & Drop");
  });
});

describe("TestSessionStatusBadge", () => {
  it("renders the translated test session status", () => {
    const { container } = render(<TestSessionStatusBadge status="CANCELED" />);

    expect(container).toHaveTextContent("Canceled");
  });
});

describe("StudentTestSessionStatusBadge", () => {
  it("renders the translated student session status", () => {
    const { container } = render(
      <StudentTestSessionStatusBadge status="STARTED" />,
    );

    expect(container).toHaveTextContent("Started");
  });
});

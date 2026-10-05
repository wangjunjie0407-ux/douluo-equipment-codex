import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("dashboard modules", () => {
  it("switches from soul rings to the market module", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "魂环资料库" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /装备物价表/ }));
    expect(screen.getByRole("heading", { name: "装备物价表" })).toBeInTheDocument();
    expect(screen.getByText("一区物价表 · 2026.8")).toBeInTheDocument();
  });

  it("shows a clear action when search has no result", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText("搜索魂环"), { target: { value: "不存在的魂环" } });
    expect(screen.getByText("没有找到匹配的魂环")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "清除筛选" }));
    expect(screen.queryByText("没有找到匹配的魂环")).not.toBeInTheDocument();
  });
});

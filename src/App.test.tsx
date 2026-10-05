import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("dashboard modules", () => {
  it("shows the developer credit in the prominent page header", () => {
    render(<App />);
    expect(screen.getByText("本程序由股神开发")).toHaveClass("developer-credit");
  });

  it("switches from soul rings to the market module", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "装备属性库" })).toBeInTheDocument();
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

  it("preserves each module's search state across tab switches", () => {
    render(<App />);

    const ringSearch = screen.getByLabelText("搜索魂环");
    fireEvent.change(ringSearch, { target: { value: "风狒狒" } });
    fireEvent.click(screen.getByRole("button", { name: /装备物价表/ }));

    const marketSearch = screen.getByLabelText("搜索物品");
    fireEvent.change(marketSearch, { target: { value: "龙金" } });
    fireEvent.click(screen.getByRole("button", { name: /装备属性库/ }));
    expect(screen.getByLabelText("搜索魂环")).toHaveValue("风狒狒");

    fireEvent.click(screen.getByRole("button", { name: /装备物价表/ }));
    expect(screen.getByLabelText("搜索物品")).toHaveValue("龙金");
  });

  it("switches among soul rings, soul devices, soul bones and badges", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /魂环 258/ })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: /魂导器 41/ }));
    expect(screen.getByText("蛇年大吉")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /魂骨 57/ }));
    expect(screen.getByText("帝天头骨")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /徽章 23/ }));
    expect(screen.getByText("魔法深渊之章")).toBeInTheDocument();
  });

  it("preserves each equipment category search state after a round trip", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /魂导器 41/ }));
    fireEvent.change(screen.getByLabelText("搜索魂导器"), { target: { value: "蛇年" } });
    fireEvent.click(screen.getByRole("button", { name: /魂骨 57/ }));
    fireEvent.change(screen.getByLabelText("搜索魂骨"), { target: { value: "帝天" } });
    fireEvent.click(screen.getByRole("button", { name: /魂导器 41/ }));
    expect(screen.getByLabelText("搜索魂导器")).toHaveValue("蛇年");
    fireEvent.click(screen.getByRole("button", { name: /魂骨 57/ }));
    expect(screen.getByLabelText("搜索魂骨")).toHaveValue("帝天");
  });

  it("classifies necklaces, rings and hidden weapons and links range pricing", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /装备物价表/ }));

    const category = screen.getByRole("combobox", { name: "分类" });
    expect(screen.getByRole("option", { name: "项链" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "戒指" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "暗器" })).toBeInTheDocument();

    fireEvent.change(category, { target: { value: "戒指" } });
    expect(screen.getByText("死漂属性戒指")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "戒指", level: 4 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "暗器", level: 4 })).not.toBeInTheDocument();

    fireEvent.change(category, { target: { value: "暗器" } });
    expect(screen.getByRole("heading", { name: "暗器", level: 4 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "戒指", level: 4 })).not.toBeInTheDocument();
  });

  it("shows the complete badge critical-damage price ladder", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /装备物价表/ }));
    const category = screen.getByRole("combobox", { name: "分类" });
    expect(screen.getByRole("option", { name: "徽章" })).toBeInTheDocument();
    fireEvent.change(category, { target: { value: "徽章" } });

    const table = screen.getByRole("table", { name: "徽章爆伤点券价格" });
    expect(within(table).getAllByRole("row")).toHaveLength(14);
    expect(within(table).getByText("80%")).toBeInTheDocument();
    expect(within(table).getByText("500")).toBeInTheDocument();
    expect(within(table).getByText("170%")).toBeInTheDocument();
    expect(within(table).getByText("5000")).toBeInTheDocument();
  });

  it("shows only three-to-five-hole soul-device critical-damage pricing", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /装备物价表/ }));
    const category = screen.getByRole("combobox", { name: "分类" });
    expect(screen.getByRole("option", { name: "魂导器" })).toBeInTheDocument();
    fireEvent.change(category, { target: { value: "魂导器" } });

    const table = screen.getByRole("table", { name: "魂导器爆伤点券价格" });
    expect(within(table).getByText("三孔")).toBeInTheDocument();
    expect(within(table).getByText("四孔")).toBeInTheDocument();
    expect(within(table).getByText("五孔")).toBeInTheDocument();
    expect(within(table).queryByText("一孔")).not.toBeInTheDocument();
    expect(within(table).queryByText("二孔")).not.toBeInTheDocument();
    expect(within(table).getByText("50%")).toBeInTheDocument();
    expect(within(table).getByText("2500")).toBeInTheDocument();
    expect(within(table).getByText("100%")).toBeInTheDocument();
    expect(within(table).getByText("12000")).toBeInTheDocument();
  });
});

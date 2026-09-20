import { describe, expect, it } from "vitest";
import {
  chartRangeHeading,
  historyBounds,
  historyForRange,
  isRollingFiveYearWindow,
  validateHistoryDate,
  type HistoryPoint,
} from "./price-state";

const day = (value: string, close = 1): HistoryPoint => ({ date: new Date(`${value}T00:00:00.000Z`), close });
const format = (date: Date) => new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC", day: "numeric", month: "long", year: "numeric",
}).format(date);

describe("AURUM history bounds", () => {
  const points = [day("2021-09-20"), day("2026-09-18")];
  const bounds = historyBounds(points);

  it("derives the complete extent and count from returned points", () => {
    expect(bounds).toEqual({ earliest: points[0]?.date, latest: points[1]?.date, count: 2 });
  });

  it("detects rolling windows from their actual span", () => {
    expect(bounds && isRollingFiveYearWindow(bounds)).toBe(true);
    const fixed = historyBounds([day("2010-01-01"), day("2026-09-18")]);
    expect(fixed && isRollingFiveYearWindow(fixed)).toBe(false);
  });

  it("returns specific malformed and boundary messages", () => {
    expect(validateHistoryDate("", bounds, format)).toBe("Enter a date in the format DD/MM/YYYY.");
    expect(validateHistoryDate("2021-09-19", bounds, format)).toBe("We only hold daily closes from 20 September 2021 onward. Try a later date.");
    expect(validateHistoryDate("2026-09-19", bounds, format)).toBe("The most recent stored close is 18 September 2026. Try an earlier date.");
    expect(validateHistoryDate("2021-09-20", bounds, format)).toBeNull();
  });

  it("keeps every fetched point in the widest chart range", () => {
    const many = Array.from({ length: 1258 }, (_, index) => ({ date: new Date(index * 86_400_000), close: index + 1 }));
    expect(historyForRange(many, "5Y", new Date())).toHaveLength(1258);
  });

  it("labels a shorter-than-requested range by its actual start", () => {
    expect(chartRangeHeading("5Y", [day("2025-01-01"), day("2026-01-01")])).toBe("Available daily closes from 1 January 2025");
    expect(chartRangeHeading("5Y", points)).toBe("Five years of daily closes");
  });
});
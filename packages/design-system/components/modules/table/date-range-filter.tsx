"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import { Calendar } from "@xbase/design-system/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@xbase/design-system/components/ui/popover";
import { Separator } from "@xbase/design-system/components/ui/separator";
import { cn } from "@xbase/design-system/lib/utils";
import { CalendarDays, X } from "@xbase/icons/lucide";
import { useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

interface DataTableDateRangeFilterProps {
  disabled?: boolean;
  endDate?: string | null;
  label?: string;
  onChange: (range: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  placeholder?: string;
  startDate?: string | null;
}

interface Preset {
  label: string;
  range: () => Required<DateRange>;
}

function toDateParam(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateParam(value?: string | null) {
  if (!value) {
    return;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!(year && month && day)) {
    return;
  }

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function createPresets(today = new Date()): Preset[] {
  const currentWeekStart = startOfWeek(today);
  const lastWeekStart = addDays(currentWeekStart, -7);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  return [
    { label: "Today", range: () => ({ from: today, to: today }) },
    {
      label: "Yesterday",
      range: () => ({ from: addDays(today, -1), to: addDays(today, -1) }),
    },
    {
      label: "Last 7 days",
      range: () => ({ from: addDays(today, -6), to: today }),
    },
    {
      label: "Last 14 days",
      range: () => ({ from: addDays(today, -13), to: today }),
    },
    {
      label: "Last 30 days",
      range: () => ({ from: addDays(today, -29), to: today }),
    },
    {
      label: "This Week",
      range: () => ({ from: currentWeekStart, to: today }),
    },
    {
      label: "Last Week",
      range: () => ({ from: lastWeekStart, to: addDays(currentWeekStart, -1) }),
    },
    {
      label: "This Month",
      range: () => ({ from: startOfMonth(today), to: today }),
    },
    {
      label: "Last Month",
      range: () => ({
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      }),
    },
  ];
}

function formatRangeLabel({
  endDate,
  placeholder = "Created date",
  startDate,
}: {
  endDate?: string | null;
  placeholder?: string;
  startDate?: string | null;
}) {
  const from = fromDateParam(startDate);
  const to = fromDateParam(endDate);

  if (from && to) {
    return `${formatDisplayDate(from)} - ${formatDisplayDate(to)}`;
  }

  if (from) {
    return `From ${formatDisplayDate(from)}`;
  }

  if (to) {
    return `Until ${formatDisplayDate(to)}`;
  }

  return placeholder;
}

export function DataTableDateRangeFilter({
  disabled = false,
  endDate,
  label,
  onChange,
  placeholder,
  startDate,
}: DataTableDateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>();
  const presets = useMemo(() => createPresets(), []);
  const hasValue = Boolean(startDate || endDate);

  useEffect(() => {
    setDraftRange({
      from: fromDateParam(startDate),
      to: fromDateParam(endDate),
    });
  }, [endDate, startDate]);

  const applyRange = (range: DateRange | undefined) => {
    const nextEndDate =
      range?.to || range?.from
        ? toDateParam((range.to ?? range.from) as Date)
        : null;

    onChange({
      startDate: range?.from ? toDateParam(range.from) : null,
      endDate: nextEndDate,
    });
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-label={label ?? placeholder ?? "Date range"}
          className={cn(
            "h-8 w-full justify-start bg-background text-left font-normal",
            {
              "text-muted-foreground": !hasValue,
            }
          )}
          disabled={disabled}
          leftIcon={<CalendarDays className="size-4" />}
          type="button"
          variant="outline"
        >
          <span className="min-w-0 truncate">
            {formatRangeLabel({ endDate, placeholder, startDate })}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(92vw,760px)] p-0"
        sideOffset={6}
      >
        <div className="grid min-w-0 grid-cols-1 md:grid-cols-[1fr_160px]">
          <div className="min-w-0 p-3">
            <Calendar
              captionLayout="dropdown"
              className="w-full [--cell-size:2.25rem]"
              mode="range"
              numberOfMonths={2}
              onSelect={setDraftRange}
              selected={draftRange}
            />
          </div>

          <div className="border-border border-t p-2 md:border-t-0 md:border-l">
            <div className="grid grid-cols-2 gap-1 md:grid-cols-1">
              {presets.map((preset) => (
                <Button
                  className="justify-start"
                  key={preset.label}
                  onClick={() => {
                    const range = preset.range();
                    setDraftRange(range);
                    applyRange(range);
                    setOpen(false);
                  }}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-2 p-2">
          <Button
            disabled={!(draftRange?.from || draftRange?.to || hasValue)}
            leftIcon={<X className="size-3.5" />}
            onClick={() => {
              setDraftRange(undefined);
              applyRange(undefined);
              setOpen(false);
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            Clear
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setOpen(false)}
              size="sm"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={!(draftRange?.from || draftRange?.to)}
              onClick={() => {
                applyRange(draftRange);
                setOpen(false);
              }}
              size="sm"
              type="button"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

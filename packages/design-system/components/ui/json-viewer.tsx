"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import { Separator } from "@xbase/design-system/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@xbase/design-system/components/ui/tooltip";
import { useIsMobile } from "@xbase/design-system/hooks/use-mobile";
import { cn } from "@xbase/design-system/lib/utils";
import { Check, ChevronRight, Copy } from "@xbase/icons/lucide";
import type { JSX } from "react";
import React, { useMemo, useState } from "react";

type JsonValue =
  | boolean
  | null
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

interface JsonViewerProps {
  className?: string;
  collapseOn?: "click" | "doubleClick";
  data: Record<string, JsonValue>;
  defaultExpanded?: boolean | number;
  showColorIndent?: boolean;
  showLineNumbers?: boolean;
  title?: string;
  truncation?: Partial<TruncationSettings>;
}

interface TruncationSettings {
  enabled: boolean;
  itemsPerArray: number;
}

type DataType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "object"
  | "array"
  | "unknown";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;
const HEX_COLOR_PATTERN = /^#([0-9A-F]{3}){1,2}$/i;
const RGB_COLOR_PATTERN = /^rgba?\(/;
const HSL_COLOR_PATTERN = /^hsla?\(/;
const URL_PATTERN = /^https?:\/\//;

const isJsonRecord = (value: unknown): value is Record<string, JsonValue> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getDataType = (value: unknown): DataType => {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  const type = typeof value;
  if (
    type === "string" ||
    type === "number" ||
    type === "boolean" ||
    type === "object"
  ) {
    return type;
  }
  return "unknown";
};

const getTypeStyle = (type: DataType): string => {
  switch (type) {
    case "string":
      return "text-green-600 dark:text-green-400";
    case "number":
      return "text-orange-600 dark:text-orange-400";
    case "boolean":
      return "text-blue-600 dark:text-blue-400";
    case "null":
      return "text-gray-500 dark:text-gray-400";
    default:
      return "";
  }
};

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (Math.abs(diffInSeconds) < 60) {
    return "just now";
  }

  const intervals = {
    year: 31_536_000,
    month: 2_592_000,
    week: 604_800,
    day: 86_400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (interval >= 1) {
      const suffix = diffInSeconds > 0 ? "ago" : "from now";
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ${suffix}`;
    }
  }

  return "just now";
};

const detectDate = (value: unknown): Date | null => {
  if (typeof value === "string") {
    if (ISO_DATE_PATTERN.test(value)) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }
  } else if (typeof value === "number") {
    if (value >= 946_684_800 && value <= 4_102_444_800) {
      return new Date(value * 1000);
    }
    if (value >= 946_684_800_000 && value <= 4_102_444_800_000) {
      return new Date(value);
    }
  }
  return null;
};

const CopyJsonButton: React.FC<{ value: string; className?: string }> = ({
  value,
  className,
}) => {
  const [hasCopied, setHasCopied] = useState(false);

  React.useEffect(() => {
    if (!hasCopied) {
      return;
    }

    const timer = window.setTimeout(() => setHasCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [hasCopied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setHasCopied(true);
  };

  const copyJson = () => {
    handleCopy();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={hasCopied ? "Copied JSON" : "Copy JSON"}
          className={cn(
            "static size-7 rounded-none bg-transparent text-foreground hover:bg-muted hover:opacity-100 focus-visible:opacity-100",
            className
          )}
          onClick={copyJson}
          size="icon"
          title={hasCopied ? "Copied" : "Copy JSON"}
          type="button"
          variant="ghost"
        >
          {hasCopied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{hasCopied ? "Copied" : "Copy JSON"}</TooltipContent>
    </Tooltip>
  );
};

const isColorValue = (value: string) =>
  HEX_COLOR_PATTERN.test(value) ||
  RGB_COLOR_PATTERN.test(value) ||
  HSL_COLOR_PATTERN.test(value);

interface SmartValueProps extends React.HTMLAttributes<HTMLElement> {
  type: DataType;
  value: JsonValue;
}

const ExpandButton: React.FC<{
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}> = ({ isExpanded, setIsExpanded }) => (
  <Button
    className="h-auto select-none p-0 text-muted-foreground text-xs underline hover:text-foreground"
    onClick={(event) => {
      event.stopPropagation();
      setIsExpanded(!isExpanded);
    }}
    size="sm"
    variant="link"
  >
    {isExpanded ? "Show less" : "Show more"}
  </Button>
);

const ColorStringValue: React.FC<
  { value: string } & React.HTMLAttributes<HTMLElement>
> = ({ value, className, ...props }) => (
  <span
    {...props}
    className={cn(
      "inline-flex items-center gap-1.5 whitespace-nowrap",
      className
    )}
  >
    <span
      className="h-3 w-3 shrink-0 rounded-[2px] border border-white/20"
      style={{ backgroundColor: value }}
    />
    <span className="text-green-600 dark:text-green-400">{`'${value}'`}</span>
  </span>
);

const UrlStringValue: React.FC<
  {
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
    value: string;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ isExpanded, setIsExpanded, value, className, onClick, ...props }) => {
  const isLongUrl = value.length > 50;
  const isVeryLongUrl = value.length > 180;

  const anchor = (
    <a
      {...props}
      className={cn(
        "text-green-600 transition-colors hover:text-blue-600 hover:underline dark:text-green-400 dark:hover:text-blue-400",
        isLongUrl ? "whitespace-pre-wrap break-all" : "whitespace-nowrap",
        isVeryLongUrl && !isExpanded && "line-clamp-3",
        className
      )}
      href={value}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      rel="noopener noreferrer"
      style={
        isVeryLongUrl && !isExpanded
          ? {
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }
          : props.style
      }
      target="_blank"
    >
      {`'${value}'`}
    </a>
  );

  if (!isVeryLongUrl) {
    return anchor;
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      {anchor}
      <ExpandButton isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
    </span>
  );
};

const RegularStringValue: React.FC<
  {
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
    value: string;
  } & React.HTMLAttributes<HTMLElement>
> = ({ isExpanded, setIsExpanded, value, className, ...props }) => {
  const isLongString = value.length > 50;
  const isVeryLongString = value.length > 180;
  const stringElement = (
    <span
      {...props}
      className={cn(
        getTypeStyle("string"),
        isLongString
          ? "wrap-break-words whitespace-pre-wrap"
          : "whitespace-nowrap",
        isVeryLongString && !isExpanded && "line-clamp-3",
        className
      )}
      style={
        isVeryLongString && !isExpanded
          ? {
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }
          : props.style
      }
    >
      {`'${value}'`}
    </span>
  );

  if (!isVeryLongString) {
    return stringElement;
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      {stringElement}
      <ExpandButton isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
    </span>
  );
};

const SmartValue: React.FC<SmartValueProps> = ({ value, type, ...props }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (typeof value === "string") {
    if (isColorValue(value)) {
      return <ColorStringValue value={value} {...props} />;
    }
    if (URL_PATTERN.test(value)) {
      return (
        <UrlStringValue
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          value={value}
          {...props}
        />
      );
    }
    return (
      <RegularStringValue
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        value={value}
        {...props}
      />
    );
  }

  const typeStyle = getTypeStyle(type);
  if (type === "null") {
    return (
      <span
        {...props}
        className={cn(typeStyle, "whitespace-nowrap", props.className)}
      >
        null
      </span>
    );
  }
  return (
    <span
      {...props}
      className={cn(typeStyle, "whitespace-nowrap", props.className)}
    >
      {String(value)}
    </span>
  );
};
SmartValue.displayName = "SmartValue";

const calculateLineCount = (
  data: JsonValue,
  expandedPaths: Set<string>,
  truncation: TruncationSettings,
  path = "root",
  level = 0
): number => {
  if (isJsonRecord(data)) {
    const isOpen = expandedPaths.has(path);
    if (!isOpen) {
      return 1;
    }
    const entries = Object.entries(data);
    if (entries.length === 0) {
      return 2;
    }
    return (
      2 +
      entries.reduce(
        (acc, [key, value]) =>
          acc +
          calculateLineCount(
            value,
            expandedPaths,
            truncation,
            `${path}.${key}`,
            level + 1
          ),
        0
      )
    );
  }

  if (Array.isArray(data)) {
    const isOpen = expandedPaths.has(path);
    if (!isOpen) {
      return 1;
    }
    if (data.length === 0) {
      return 2;
    }

    if (truncation.enabled && data.length > truncation.itemsPerArray) {
      const visibleItems = data.slice(0, truncation.itemsPerArray);
      return (
        3 +
        visibleItems.reduce(
          (acc: number, item: JsonValue, index: number) =>
            acc +
            calculateLineCount(
              item,
              expandedPaths,
              truncation,
              `${path}[${index}]`,
              level + 1
            ),
          0
        )
      );
    }

    return (
      2 +
      data.reduce(
        (acc: number, item: JsonValue, index: number) =>
          acc +
          calculateLineCount(
            item,
            expandedPaths,
            truncation,
            `${path}[${index}]`,
            level + 1
          ),
        0
      )
    );
  }

  return 1;
};

const addChildPaths = (paths: Set<string>, childPaths: Set<string>) => {
  for (const path of childPaths) {
    paths.add(path);
  }
};

const addArrayPaths = (
  paths: Set<string>,
  data: JsonValue[],
  maxLevel: number,
  currentLevel: number,
  currentPath: string
) => {
  for (const [index, item] of data.entries()) {
    addChildPaths(
      paths,
      generateAllPaths(
        item,
        maxLevel,
        currentLevel + 1,
        `${currentPath}[${index}]`
      )
    );
  }
};

const addObjectPaths = (
  paths: Set<string>,
  data: Record<string, JsonValue>,
  maxLevel: number,
  currentLevel: number,
  currentPath: string
) => {
  for (const [key, value] of Object.entries(data)) {
    addChildPaths(
      paths,
      generateAllPaths(
        value,
        maxLevel,
        currentLevel + 1,
        `${currentPath}.${key}`
      )
    );
  }
};

const generateAllPaths = (
  data: JsonValue,
  maxLevel: number = Number.POSITIVE_INFINITY,
  currentLevel = 0,
  currentPath = "root"
): Set<string> => {
  const paths = new Set<string>();
  if (currentLevel > maxLevel) {
    return paths;
  }

  if (!(typeof data === "object" && data !== null)) {
    return paths;
  }

  paths.add(currentPath);
  if (Array.isArray(data)) {
    addArrayPaths(paths, data, maxLevel, currentLevel, currentPath);
    return paths;
  }

  if (isJsonRecord(data)) {
    addObjectPaths(paths, data, maxLevel, currentLevel, currentPath);
  }

  return paths;
};

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  className,
  truncation: truncationProp,
  showLineNumbers = true,
  showColorIndent = false,
  collapseOn = "click",
  defaultExpanded = false,
  title,
}) => {
  const isMobile = useIsMobile();

  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(() => {
    if (typeof defaultExpanded === "number") {
      return generateAllPaths(data, defaultExpanded);
    }
    if (defaultExpanded === true) {
      return generateAllPaths(data);
    }
    const initialPaths = new Set<string>();
    if (typeof data === "object" && data !== null) {
      initialPaths.add("root");
    }
    return initialPaths;
  });

  const expandAll = () => {
    setExpandedPaths(generateAllPaths(data));
  };

  const collapseAll = () => {
    setExpandedPaths(new Set(["root"]));
  };

  const truncation: TruncationSettings = React.useMemo(
    () => ({
      enabled: isMobile ? false : (truncationProp?.enabled ?? true),
      itemsPerArray: truncationProp?.itemsPerArray ?? 5,
    }),
    [truncationProp, isMobile]
  );

  const toggleNode = (path: string) => {
    setExpandedPaths((prev) => {
      const newPaths = new Set(prev);
      if (newPaths.has(path)) {
        newPaths.delete(path);
      } else {
        newPaths.add(path);
      }
      return newPaths;
    });
  };

  const lineCount = useMemo(
    () => calculateLineCount(data, expandedPaths, truncation),
    [data, expandedPaths, truncation]
  );

  return (
    <div
      className={cn(
        "relative flex w-full flex-col rounded-md border border-border bg-secondary/10 font-mono text-[13px] text-foreground leading-6 dark:bg-muted/50",
        className
      )}
    >
      <div className="z-10 flex items-center justify-between gap-2 p-2">
        <div className="px-2 font-medium text-muted-foreground text-xs">
          {title}
        </div>
        <div className="flex items-center overflow-hidden rounded-md border bg-muted/50">
          <Button
            className="h-7 rounded-none px-2 text-xs hover:bg-muted"
            onClick={expandAll}
            size="sm"
            title="Expand All"
            variant="ghost"
          >
            Expand All
          </Button>
          <Separator className="h-4" orientation="vertical" />
          <Button
            className="h-7 rounded-none px-2 text-xs hover:bg-muted"
            onClick={collapseAll}
            size="sm"
            title="Collapse All"
            variant="ghost"
          >
            Collapse All
          </Button>
          <Separator className="h-4" orientation="vertical" />
          <CopyJsonButton value={JSON.stringify(data, null, 2)} />
        </div>
      </div>
      <div className="w-full flex-1 overflow-auto p-4 pt-0">
        <pre className="flex">
          {showLineNumbers && (
            <div className="hidden sm:block">
              <LineNumbers lineCount={lineCount} />
            </div>
          )}
          <code>
            <JsonNode
              collapseOn={collapseOn}
              data={data}
              expandedPaths={expandedPaths}
              path="root"
              showColorIndent={showColorIndent}
              toggleNode={toggleNode}
              truncation={truncation}
            />
          </code>
        </pre>
      </div>
    </div>
  );
};

const LineNumbers: React.FC<{ lineCount: number }> = ({ lineCount }) => (
  <div className="mr-4 flex select-none flex-col border-border border-r pr-4 text-right text-muted-foreground">
    {Array.from({ length: lineCount }, (_, index) => index + 1).map((line) => (
      <div
        className="h-6 text-xs tabular-nums leading-6 opacity-50"
        key={`line-${line}`}
      >
        {line}
      </div>
    ))}
  </div>
);

interface JsonNodeProps {
  collapseOn?: "click" | "doubleClick";
  data: JsonValue;
  expandedPaths: Set<string>;
  level?: number;
  objectKey?: string;
  path: string;
  showColorIndent?: boolean;
  showComma?: boolean;
  toggleNode: (path: string) => void;
  truncation: TruncationSettings;
}

const JsonNode: React.FC<JsonNodeProps> = ({
  data,
  level = 0,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  truncation,
  showColorIndent,
  collapseOn,
}) => {
  const dataType = getDataType(data);

  const renderValue = () => {
    let element: JSX.Element | null = null;
    switch (dataType) {
      case "array":
        if (Array.isArray(data)) {
          element = (
            <JsonArray
              collapseOn={collapseOn}
              data={data}
              expandedPaths={expandedPaths}
              level={level}
              objectKey={objectKey}
              path={path}
              showColorIndent={showColorIndent}
              showComma={showComma}
              toggleNode={toggleNode}
              truncation={truncation}
            />
          );
        }
        break;
      case "object":
        if (isJsonRecord(data)) {
          element = (
            <JsonObject
              collapseOn={collapseOn}
              data={data}
              expandedPaths={expandedPaths}
              level={level}
              objectKey={objectKey}
              path={path}
              showColorIndent={showColorIndent}
              showComma={showComma}
              toggleNode={toggleNode}
              truncation={truncation}
            />
          );
        }
        break;
      default:
        element = <SmartValue type={dataType} value={data} />;
        break;
    }

    if (dataType === "object" || dataType === "array") {
      return element;
    }

    const date = detectDate(data);
    if (date) {
      const timeStr = formatRelativeTime(date);
      return (
        <span className="inline-flex items-center gap-2">
          {element}
          <span className="select-none text-muted-foreground/60 text-xs italic">
            {`// ${timeStr}`}
          </span>
        </span>
      );
    }

    return element;
  };

  return (
    <>
      {renderValue()}
      {dataType !== "object" && dataType !== "array" && showComma && (
        <span className="text-muted-foreground">,</span>
      )}
    </>
  );
};

const indentColors = [
  "border-red-300/60 dark:border-red-700/60",
  "border-yellow-300/60 dark:border-yellow-700/60",
  "border-green-300/60 dark:border-green-700/60",
  "border-blue-300/60 dark:border-blue-700/60",
  "border-purple-300/60 dark:border-purple-700/60",
];

const toggleOnKeyboard = (
  event: React.KeyboardEvent<HTMLElement>,
  toggle: () => void
) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggle();
  }
};

const JsonObject: React.FC<{
  objectKey?: string;
  data: Record<string, JsonValue>;
  level: number;
  path: string;
  expandedPaths: Set<string>;
  toggleNode: (path: string) => void;
  showComma?: boolean;
  truncation: TruncationSettings;
  showColorIndent?: boolean;
  collapseOn?: "click" | "doubleClick";
}> = ({
  data,
  level,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  truncation,
  showColorIndent,
  collapseOn,
}) => {
  const entries = Object.entries(data);
  const isOpen = expandedPaths.has(path);

  const trigger = (
    <button
      aria-expanded={isOpen}
      className={cn(
        "group -ml-1 inline-flex h-6 w-full cursor-pointer select-none items-center rounded-sm px-1 text-left leading-6",
        isOpen && "hover:bg-muted-foreground/20"
      )}
      onClick={
        collapseOn === "doubleClick"
          ? undefined
          : () => {
              toggleNode(path);
            }
      }
      onDoubleClick={
        collapseOn === "doubleClick" ? () => toggleNode(path) : undefined
      }
      onKeyDown={
        collapseOn === "doubleClick"
          ? (event) => toggleOnKeyboard(event, () => toggleNode(path))
          : undefined
      }
      type="button"
    >
      {objectKey && (
        <span className="group inline-flex items-center font-medium text-purple-600 dark:text-purple-400">
          {`'${objectKey}'`}
          <span className="mx-1 text-muted-foreground">: </span>
        </span>
      )}
      <span className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground group-hover:text-foreground">
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            isOpen && "rotate-90"
          )}
        />
      </span>
      <span className="text-muted-foreground">{"{"}</span>
      {!isOpen && (
        <>
          <span className="text-muted-foreground">...</span>
          <span className="text-muted-foreground">
            {"}"} ({entries.length} {entries.length > 1 ? "items" : "item"})
          </span>
          {showComma && <span className="text-muted-foreground">,</span>}
        </>
      )}
    </button>
  );

  return (
    <div>
      {trigger}
      {isOpen && (
        <div className="transition-all duration-200">
          <div
            className={cn(
              "border-l pl-5",
              showColorIndent
                ? indentColors[level % indentColors.length]
                : "border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
            )}
          >
            {entries.map(([key, value], index) => {
              const childPath = `${path}.${key}`;
              const dataType = getDataType(value);
              const isChildCollapsible =
                dataType === "object" || dataType === "array";
              const isChildOpen =
                isChildCollapsible && expandedPaths.has(childPath);

              return (
                <div
                  className={cn(
                    "group rounded-md",
                    !isChildCollapsible && "flex min-h-6 items-start",
                    isChildOpen ? "" : "hover:bg-muted-foreground/20"
                  )}
                  key={`object-${path}.${key}`}
                >
                  {isChildCollapsible ? (
                    <JsonNode
                      collapseOn={collapseOn}
                      data={value}
                      expandedPaths={expandedPaths}
                      level={level + 1}
                      objectKey={key}
                      path={childPath}
                      showColorIndent={showColorIndent}
                      showComma={index < entries.length - 1}
                      toggleNode={toggleNode}
                      truncation={truncation}
                    />
                  ) : (
                    <>
                      <span className="inline-flex items-center text-purple-600 dark:text-purple-400">
                        {`'${key}'`}
                      </span>
                      <span className="text-muted-foreground">: </span>
                      <JsonNode
                        collapseOn={collapseOn}
                        data={value}
                        expandedPaths={expandedPaths}
                        level={level + 1}
                        path={childPath}
                        showColorIndent={showColorIndent}
                        showComma={index < entries.length - 1}
                        toggleNode={toggleNode}
                        truncation={truncation}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div>
            <span className="text-muted-foreground">{"}"}</span>
            {showComma && <span className="text-muted-foreground">,</span>}
          </div>
        </div>
      )}
    </div>
  );
};

const JsonArray: React.FC<{
  objectKey?: string;
  data: JsonValue[];
  level: number;
  path: string;
  expandedPaths: Set<string>;
  toggleNode: (path: string) => void;
  showComma?: boolean;
  truncation: TruncationSettings;
  showColorIndent?: boolean;
  collapseOn?: "click" | "doubleClick";
}> = ({
  data,
  level,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  truncation,
  showColorIndent,
  collapseOn,
}) => {
  const isOpen = expandedPaths.has(path);
  const [showAll, setShowAll] = useState(false);

  const itemsToShow =
    truncation.enabled && !showAll && data.length > truncation.itemsPerArray
      ? data.slice(0, truncation.itemsPerArray)
      : data;

  const handleShowMore = () => {
    setShowAll(true);
  };

  const trigger = (
    <button
      aria-expanded={isOpen}
      className={cn(
        "group -ml-1 inline-flex h-6 w-full cursor-pointer select-none items-center rounded-sm px-1 text-left leading-6",
        isOpen && "hover:bg-muted-foreground/20"
      )}
      onClick={
        collapseOn === "doubleClick"
          ? undefined
          : () => {
              toggleNode(path);
            }
      }
      onDoubleClick={
        collapseOn === "doubleClick" ? () => toggleNode(path) : undefined
      }
      onKeyDown={
        collapseOn === "doubleClick"
          ? (event) => toggleOnKeyboard(event, () => toggleNode(path))
          : undefined
      }
      type="button"
    >
      {objectKey && (
        <span className="group inline-flex items-center text-purple-600 dark:text-purple-400">
          {`'${objectKey}'`}
          <span className="mx-1 text-muted-foreground">: </span>
        </span>
      )}
      <span className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground group-hover:text-foreground">
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            isOpen && "rotate-90"
          )}
        />
      </span>
      <span className="text-muted-foreground">{"["}</span>
      {!isOpen && (
        <>
          <span className="text-muted-foreground">...</span>
          <span className="text-muted-foreground">
            {"]"} ({data.length} items)
          </span>
          {showComma && <span className="text-muted-foreground">,</span>}
        </>
      )}
    </button>
  );

  return (
    <div>
      {trigger}
      {isOpen && (
        <div className="transition-all duration-200">
          <div
            className={cn(
              "border-l pl-5",
              showColorIndent
                ? indentColors[level % indentColors.length]
                : "border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
            )}
          >
            {itemsToShow.map((item, index) => {
              const childPath = `${path}[${index}]`;
              const dataType = getDataType(item);
              const isChildCollapsible =
                dataType === "object" || dataType === "array";
              const isChildOpen =
                isChildCollapsible && expandedPaths.has(childPath);

              return (
                <div
                  className={cn(
                    "group rounded-md",
                    !isChildCollapsible &&
                      "flex h-auto items-start sm:h-6 sm:items-center",
                    isChildOpen ? "" : "hover:bg-muted-foreground/20"
                  )}
                  key={`array-${childPath}`}
                >
                  <JsonNode
                    collapseOn={collapseOn}
                    data={item}
                    expandedPaths={expandedPaths}
                    level={level + 1}
                    path={childPath}
                    showColorIndent={showColorIndent}
                    showComma={index < data.length - 1}
                    toggleNode={toggleNode}
                    truncation={truncation}
                  />
                </div>
              );
            })}
            {truncation.enabled && data.length > truncation.itemsPerArray && (
              <div className="pl-5">
                {showAll ? (
                  <Button
                    className="mt-1 h-auto bg-secondary/30 px-2 py-0.5 text-muted-foreground text-xs hover:bg-secondary/50 hover:text-foreground"
                    onClick={() => setShowAll(false)}
                    size="sm"
                    variant="secondary"
                  >
                    Show Less
                  </Button>
                ) : (
                  <Button
                    className="mt-1 h-auto bg-secondary/30 px-2 py-0.5 text-muted-foreground text-xs hover:bg-secondary/50 hover:text-foreground"
                    onClick={handleShowMore}
                    size="sm"
                    variant="secondary"
                  >
                    Show {data.length - truncation.itemsPerArray} more items...
                  </Button>
                )}
              </div>
            )}
          </div>
          <div>
            <span className="text-muted-foreground">]</span>
            {showComma && <span className="text-muted-foreground">,</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export { JsonViewer };
export default JsonViewer;

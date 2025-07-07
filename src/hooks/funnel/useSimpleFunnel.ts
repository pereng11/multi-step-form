import { useCallback, useMemo, useState } from "react";
import type {
  FunnelHistory,
  FunnelRenderComponent,
  FunnelState,
  UseFunnelResults,
} from "./types";
import { UseFunnelOptions } from "./types";

export const useSimpleFunnel = <T extends Record<string, unknown>>(
  options: UseFunnelOptions<T>
): UseFunnelResults<T> => {
  const { initial } = options;

  const [historySteps, setHistorySteps] = useState<FunnelState<T>[]>([
    { step: initial.step, context: initial.context },
  ]);
  const [index, setIndex] = useState(0);

  const currentStep = useMemo(
    () => historySteps[index]?.step,
    [historySteps, index]
  );
  const currentContext = useMemo(
    () => historySteps[index]?.context,
    [historySteps, index]
  );

  const push = useCallback(
    <K extends keyof T>(
      step: K,
      context: T[K] | ((prev: T[keyof T]) => T[K])
    ) => {
      setHistorySteps((prev) => {
        const prevContext = prev[index]?.context;
        const nextContext =
          typeof context === "function"
            ? (context as (prev: T[keyof T]) => T[K])(prevContext)
            : context;
        return [...prev.slice(0, index + 1), { step, context: nextContext }];
      });
      setIndex((prevIdx) => prevIdx + 1);
    },
    [index]
  );

  const replace = useCallback(
    <K extends keyof T>(
      step: K,
      context: T[K] | ((prev: T[keyof T]) => T[K])
    ) => {
      setHistorySteps((prev) => {
        const prevContext = prev[index]?.context;
        const nextContext =
          typeof context === "function"
            ? (context as (prev: T[keyof T]) => T[K])(prevContext)
            : context;
        return [...prev.slice(0, index), { step, context: nextContext }];
      });
    },
    [index]
  );

  const go = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= historySteps.length) {
        console.warn("히스토리 범위를 벗어났습니다.");
        return;
      }
      setIndex(targetIndex);
    },
    [historySteps.length]
  );

  const back = useCallback(() => {
    if (index === 0) return;
    setIndex((prevIdx) => prevIdx - 1);
  }, [index]);

  const history: FunnelHistory<T, keyof T> = useMemo(
    () => ({
      push,
      replace,
      go,
      back,
    }),
    [push, replace, go, back]
  );

  const Render: FunnelRenderComponent<T> = useCallback(
    (props) => {
      const targetStepComponent = props[currentStep];

      return targetStepComponent({ context: currentContext, history });
    },
    [currentStep, currentContext, history]
  );

  return useMemo(
    () => ({
      step: currentStep,
      context: currentContext,
      history,
      index,
      historySteps,
      Render,
    }),
    [currentStep, currentContext, history, index, historySteps, Render]
  );
};

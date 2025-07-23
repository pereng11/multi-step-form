import { ComponentType, ReactNode } from "react";

export interface FunnelState<T> {
  step: keyof T;
  context: T[keyof T];
}

export interface UseFunnelOptions<T> {
  initial: FunnelState<T>;
}

export type UseFunnelResults<T> = {
  [key in keyof T]: {
    step: key;
    context: T[key];
    history: FunnelHistory<T, key>;
  };
}[keyof T] & {
  index: number;
  historySteps: { step: keyof T; context: T[keyof T] }[];
  Render: FunnelRenderComponent<T>;
};

export interface FunnelStepComponentProps<T, Key extends keyof T> {
  context: T[Key];
  history: FunnelHistory<T, Key>;
}

type FunnelStepComponent<T> = {
  [key in keyof T]: (props: FunnelStepComponentProps<T, key>) => ReactNode;
};

export type FunnelRenderComponent<T> = ComponentType<FunnelStepComponent<T>>;

export interface FunnelHistory<TContextMap, TCurrentStep extends keyof TContextMap> {
  push: <TTargetStep extends keyof TContextMap>(
    step: TTargetStep,
    context: TContextMap[TTargetStep] | ((prev: TContextMap[TCurrentStep]) => TContextMap[TTargetStep])
  ) => Promise<void> | void;
  replace: <TTargetStep extends keyof TContextMap>(
    step: TTargetStep,
    context: TContextMap[TTargetStep] | ((prev: TContextMap[TCurrentStep]) => TContextMap[TTargetStep])
  ) => Promise<void> | void;
  go: (index: number) => void | Promise<void>;
  back: () => void | Promise<void>;
}

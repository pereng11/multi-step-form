import { QueryErrorResetBoundary } from "@tanstack/react-query";
import React, { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface QueryBoundaryProps {
  children: ReactNode;
  onError?: ({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) => React.ReactNode;
  onLoading?: () => React.ReactNode;
}

export const QueryBoundary = ({ children, onError, onLoading }: QueryBoundaryProps) => {
  // TODO: 기본 fallback 컴포넌트 추가
  const LoadingFallback = onLoading ? onLoading() : <div>로딩중...</div>;
  const ErrorFallback = onError
    ? onError
    : ({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) => (
        <div>
          에러 발생: {String(error)}
          <button onClick={resetErrorBoundary}>재시도</button>
        </div>
      );

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
          <Suspense fallback={LoadingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

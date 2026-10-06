'use client';

import * as React from 'react';
import { motion, isMotionComponent, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLMotionProps<keyof HTMLElementTagNameMap>,
  'ref'
> & { ref?: React.Ref<T> };

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps<T extends HTMLElement = HTMLElement> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
} & DOMMotionProps<T>;

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    });
  };
}

function mergeProps<T extends HTMLElement>(
  childProps: AnyProps,
  slotProps: DOMMotionProps<T>,
): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(
      childProps.className as string,
      slotProps.className as string,
    );
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

/**
 * `motion.create()` mints a brand new component type on every call, so calling
 * it while rendering — even memoised — remounts the wrapped subtree and drops
 * its state whenever the memo recomputes. Caching per element type at module
 * scope means a given child always resolves to the same motion component.
 */
const motionByTag = new Map<string, React.ElementType>();
const motionByComponent = new WeakMap<object, React.ElementType>();

function motionComponentFor(type: React.ElementType): React.ElementType {
  if (typeof type === 'string') {
    let cached = motionByTag.get(type);
    if (!cached) {
      cached = motion.create(type);
      motionByTag.set(type, cached);
    }
    return cached;
  }

  let cached = motionByComponent.get(type as object);
  if (!cached) {
    cached = motion.create(type);
    motionByComponent.set(type as object, cached);
  }
  return cached;
}

function Slot<T extends HTMLElement = HTMLElement>({
  children,
  ref,
  ...props
}: SlotProps<T>) {
  // Checked first: `children.type` below assumes an element, and this component
  // holds no hooks, so returning early is safe.
  if (!React.isValidElement(children)) return null;

  const isAlreadyMotion =
    typeof children.type === 'object' &&
    children.type !== null &&
    isMotionComponent(children.type);

  const Base = isAlreadyMotion
    ? (children.type as React.ElementType)
    : motionComponentFor(children.type as React.ElementType);

  const { ref: childRef, ...childProps } = children.props as AnyProps;

  const mergedProps = mergeProps(childProps, props);

  // `static-components` cannot see through the cache above, and an `asChild`
  // primitive cannot hoist a type it only learns at render. The cache is what
  // makes this safe: a given child type always resolves to the same component,
  // so the subtree is never remounted, which is the harm the rule guards.
  return (
    // eslint-disable-next-line react-hooks/static-components
    <Base {...mergedProps} ref={mergeRefs(childRef as React.Ref<T>, ref)} />
  );
}

export {
  Slot,
  type SlotProps,
  type WithAsChild,
  type DOMMotionProps,
  type AnyProps,
};

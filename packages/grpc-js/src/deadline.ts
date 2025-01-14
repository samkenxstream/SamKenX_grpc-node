/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

export type Deadline = Date | number;

export function minDeadline(...deadlineList: Deadline[]): Deadline {
  let minValue = Infinity;
  for (const deadline of deadlineList) {
    const deadlineMsecs =
      deadline instanceof Date ? deadline.getTime() : deadline;
    if (deadlineMsecs < minValue) {
      minValue = deadlineMsecs;
    }
  }
  return minValue;
}

const units: Array<[string, number]> = [
  ['m', 1],
  ['S', 1000],
  ['M', 60 * 1000],
  ['H', 60 * 60 * 1000],
];

export function getDeadlineTimeoutString(deadline: Deadline) {
  const now = new Date().getTime();
  if (deadline instanceof Date) {
    deadline = deadline.getTime();
  }
  const timeoutMs = Math.max(deadline - now, 0);
  for (const [unit, factor] of units) {
    const amount = timeoutMs / factor;
    if (amount < 1e8) {
      return String(Math.ceil(amount)) + unit;
    }
  }
  throw new Error('Deadline is too far in the future')
}

export function getRelativeTimeout(deadline: Deadline) {
  const deadlineMs = deadline instanceof Date ? deadline.getTime() : deadline;
  const now = new Date().getTime();
  return deadlineMs - now;
}
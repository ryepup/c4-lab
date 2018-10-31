# 3. Use redux for state management

Date: September 2017

## Status

Accepted

## Context

Having trouble keeping state consistent across different components, getting
into inconsistent states based on different sequences of user actions and
angularjs data binding.

## Decision

Use redux to decouple UI from state, having angularjs components trigger actions
that reflect user activity.

## Consequences

* large refactoring needed to move code to redux actions/reducers/state
* redux and angularjs aren't a common pair, will have to deal with some
  mismatches
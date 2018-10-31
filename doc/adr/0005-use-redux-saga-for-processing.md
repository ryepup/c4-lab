# 5. Use redux-saga for processing

Date: June 2018

## Status

Accepted

## Context

Need a place for processing / "business logic". Options:

* use redux-thunk to put logic inside action creators and dispatch multiple
  actions
* use redux-saga to decouple action creation and logic
* dispatch multiple actions from angularjs controllers

## Decision

Use redux-saga. This will play nicely with `typescript-fsa` action creators.

## Consequences

* have to learn redux-saga
* have to use a transpiler that supports the generator syntax needed by
  redux-saga
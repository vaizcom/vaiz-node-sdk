# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New `setTaskBlocker` method in SDK for managing task blocking relationships
- New `vaiz_set_task_blocker` tool in MCP server for setting task blockers
- `SetTaskBlockerRequest` and `SetTaskBlockerResponse` interfaces in task models
- Example file demonstrating the usage of `setTaskBlocker` method (`examples/set-task-blocker.ts`)

### Changed
- Updated README.md with examples of the new `setTaskBlocker` method
- Updated MCP server README.md with documentation for the new `vaiz_set_task_blocker` tool

### Technical Details
The new `setTaskBlocker` method provides a convenient way to establish blocking relationships between tasks:
- Automatically manages both sides of the relationship (blocker and blocked tasks)
- Updates leftConnectors for the blocked task (tasks that block it)
- Updates rightConnectors for the blocker task (tasks it blocks)
- Prevents duplicates by using Set operations
- Works with both task slugs (e.g., 'TASK-123') and database IDs
- Performs operations atomically using Promise.all

## [0.18.0] - Previous Release


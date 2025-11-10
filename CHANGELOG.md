# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New specialized history methods for better type safety and convenience:
  - `getTaskHistory()` - Get history for a specific task
  - `getDocumentHistory()` - Get history for a specific document
  - `getProjectHistory()` - Get history for a specific project
  - `getMilestoneHistory()` - Get history for a specific milestone
  - `getMemberHistory()` - Get history for a specific member
  - `getSpaceHistory()` - Get history for a specific space
- New MCP tools for specialized history access:
  - `get_task_history` - Get task change history
  - `get_document_history` - Get document change history
  - `get_project_history` - Get project change history
  - `get_milestone_history` - Get milestone change history
  - `get_member_history` - Get member change history
  - `get_space_history` - Get space change history
- Type definitions for all specialized history methods
- New `setTaskBlocker` method in SDK for managing task blocking relationships
- New `vaiz_set_task_blocker` tool in MCP server for setting task blockers
- `SetTaskBlockerRequest` and `SetTaskBlockerResponse` interfaces in task models
- Example file demonstrating the usage of `setTaskBlocker` method (`examples/set-task-blocker.ts`)

### Changed
- Updated README.md with examples of the new `setTaskBlocker` method
- Updated MCP server README.md with documentation for specialized history tools
- MCP server now has 35+ tools (up from 30)

### Deprecated
- `getHistory()` method - Use specialized methods like `getTaskHistory()`, `getDocumentHistory()`, etc. instead
- `get_history` MCP tool - Use specialized tools like `get_task_history`, `get_document_history`, etc. instead

### Technical Details
The new specialized history methods provide:
- Better type safety with specific request/response types for each entity
- More intuitive API (no need to specify `kind` parameter)
- Simplified usage with entity-specific parameters (e.g., `taskId` instead of `kindId`)
- Consistent with the rest of the SDK's entity-specific methods

The new `setTaskBlocker` method provides a convenient way to establish blocking relationships between tasks:
- Automatically manages both sides of the relationship (blocker and blocked tasks)
- Updates leftConnectors for the blocked task (tasks that block it)
- Updates rightConnectors for the blocker task (tasks it blocks)
- Prevents duplicates by using Set operations
- Works with both task slugs (e.g., 'TASK-123') and database IDs
- Performs operations atomically using Promise.all

## [0.18.0] - Previous Release


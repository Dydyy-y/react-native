---
name: bmad
description: 'BMAD Methodology Entry Point. Use when user types /bmad to get help or guidance on what to do next.'
---

# BMAD Help & Routing

This skill provides guidance on using the BMAD methodology. It analyzes the current state and recommends the next workflow or agent.

## Instructions

Follow the instructions defined in the workflow file:

[Load Workflow](../bmad-help/workflow.md)

If that file cannot be loaded, use the rules below (copied from bmad-help):

## ROUTING RULES

- **Empty `phase` = anytime** — Universal tools work regardless of workflow state
- **Numbered phases indicate sequence** — Phases like `1-discover` → `2-define` → `3-build` → `4-ship` flow in order
- **Stay in module** — Guide through the active module's workflow based on phase+sequence ordering
- **Descriptions contain routing** — Read for alternate paths (e.g., "back to previous if fixes needed")
- **`required=true` blocks progress** — Required workflows must complete before proceeding to later phases
- **Artifacts reveal completion** — Search resolved output paths for `outputs` patterns, fuzzy-match found files to workflow rows

## DISPLAY RULES

### Command-Based Workflows
When `command` field has a value:
- Show the command as a skill name in backticks (e.g., `bmad-bmm-create-prd`)

### Skill-Referenced Workflows
When `workflow-file` starts with `skill:`:
- The value is a skill reference (e.g., `skill:bmad-quick-dev-new-preview`), NOT a file path
- Do NOT attempt to resolve or load it as a file path
- Display using the `command` column value as a skill name in backticks (same as command-based workflows)

### Agent-Based Workflows
When `command` field is empty:
- User loads agent first by invoking the agent skill (e.g., `bmad-pm`)
- Then invokes by referencing the `code` field or describing the `name` field
- Do NOT show a slash command — show the code value and agent load instruction instead

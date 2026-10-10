---
trigger: always_on
---

# Agent Workspace Rules & System Instructions

## 1. Directory Scope & Boundary Enforcement
- Strictly limit all file creations, edits, refactoring, and code analysis to the `tibcase.web/` directory.
- Never modify, create, or alter any files outside the `tibcase.web/` directory under any circumstances unless explicitly instructed.

## 2. API Contract & Documentation Compliance
- Before executing any development or bug-fixing task, always cross-reference and align with:
  1. The local API specification file: `API_MOBILE.md`
  2. The local Swagger specification: `swagger.json` (and online Swagger: `https://dev-medic.axadjonovsardorbek.uz/api/swagger/index.html`)
- Strictly adhere to documented endpoint paths, HTTP methods, headers, request payloads, and response structures.
- Do NOT generate fake, mock, or hardcoded fallback data. All rendered data must strictly reflect live backend API responses.
- Properly handle data states (loading, empty, error) natively according to the API response contracts.

## 3. Mobile-First Responsive Design
- Follow a strict mobile-first engineering approach.
- Ensure all layouts, typography, tap targets, modal dialogs, and navigation elements are fully optimized for mobile devices (especially within mobile browsers and Telegram WebApp viewports).
- Ensure smooth scaling across standard mobile breakpoints before scaling up to tablet or desktop screens.

## 4. UI/UX Consistency & Design System Adherence
- Maintain a cohesive and unified design language across all pages, components, modals, and views.
- Ensure consistent color palettes, typography scale, spacing units (padding/margin), border radii, elevation/shadows, and micro-interactions.
- Reuse existing design tokens, components, and layout primitives rather than introducing ad-hoc or disjointed styling.
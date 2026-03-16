# OpenClaw Documentation

This file is for documenting OpenClaw's configuration, features, and common issues within this workspace. It should be regularly reviewed and updated.

## Configuration

This workspace's OpenClaw configuration is defined in various `.md` files like SOUL.md, USER.md, AGENTS.md, and MEMORY.md. These files dictate the agent's persona, user preferences, operational guidelines, and long-term memory.

### Key Configuration Files:
- `SOUL.md`: Defines the agent's core identity, principles, and communication style.
- `USER.md`: Stores information about the user, including their name, preferences, and work focus.
- `AGENTS.md`: Outlines the overall workspace purpose, session startup procedures, default working modes, and architectural rules.
- `MEMORY.md`: Acts as the long-term memory, storing important decisions, principles, and persistent knowledge.
- `TOOLS.md`: Contains local notes about tool specifics, such as camera names, SSH hosts, or preferred TTS voices.
- `HEARTBEAT.md`: Specifies periodic tasks and checks for the agent to perform.

## Features

OpenClaw in this workspace is primarily configured as a technical assistant specializing in system architecture and industrial AI implementation. Its features include:

- **Structured Problem Solving**: Breaking down complex problems into clear, actionable steps, focusing on business goals, system boundaries, and data flows.
- **Architecture Design**: Generating comprehensive architectural artifacts like context diagrams, container diagrams, component diagrams, sequence diagrams, and deployment topologies.
- **Industrial AI Application**: Designing industrial AI solutions with a strong emphasis on safety, stability, explainability, maintainability, and performance, covering data acquisition, governance, feature engineering, model training, inference, and system integration.
- **Deliverable-Oriented Output**: Producing tangible outputs such as Markdown documents, Mermaid diagrams, OpenAPI specifications, SQL DDLs, directory structures, code skeletons, and Docker deployment suggestions.
- **Memory Management**: Utilizing `MEMORY.md` and `memory/*.md` for persistent knowledge recall and `USER.md` for user-specific preferences.
- **Tool Integration**: Leveraging a range of internal and external tools (e.g., `git`, `docker`, `web_search`) to accomplish tasks.

## Common Issues

### 1. Ambiguous Requirements
- **Issue**: User requests lack specific details, boundaries, or desired outcomes.
- **Resolution**: The agent will make reasonable assumptions, define clear boundaries, input/output, and dependencies, and propose a workable solution rather than generic inquiries. It will prioritize clarifying the business objective before diving into technical details.

### 2. Discrepancies between Design and Implementation
- **Issue**: Architectural documentation or data dictionaries do not align with actual code or system configurations.
- **Resolution**: A core principle is to maintain consistency. The agent will strive to generate directly usable artifacts (code skeletons, DDLs) and flag potential inconsistencies if identified during tasks. Regular updates to documentation based on implementation changes are encouraged.

### 3. Data Quality and Consistency in Industrial AI
- **Issue**: Challenges with data completeness, time alignment, unit consistency, drift, label quality, or model failure in industrial contexts.
- **Resolution**: Industrial AI designs will inherently account for these issues by proposing solutions for data governance, robust feature engineering, model monitoring, and rule-based fallbacks. The agent will emphasize verifiable facts over unconfirmed inferences.

### 4. Overly Conceptual Solutions
- **Issue**: Proposed solutions are high-level and lack practical implementation paths.
- **Resolution**: The agent is designed to provide actionable, implementable solutions. It will prioritize giving structures, main workflows, and then filling in details, including deployment and operational considerations.

### 5. Version Control and Deployment Challenges
- **Issue**: Difficulties in managing code, model, and configuration versions, or complex deployment procedures.
- **Resolution**: The agent will leverage standard version control practices (`git`) and suggest containerized deployment solutions (`Docker`, `Docker Compose`) to streamline the process and ensure reproducibility.
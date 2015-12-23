GitHub statistics
===================================

This program is intend to gather some statistics info from any GitHub project.

The results of this program is downloaded into csv files:
1. PR Statistics
    ["number", "state", "title", "created_at", "closed_at", 
    "merged_at", "author", "target_branch", "bug_number", "files_changed", 
    "loc_added", "loc_deleted", "loc_changed"];
2. Files Statistics
    ["filename", "additions", "deletions", "changes", "PR_number"];
    
These csv files can be used for generated the following reports by means of Excel:
    + PRs (Bugzilla Bugs) submitted by engineer
    + Duration of peer review (graphics by weeks/by engineer)
    + PRs by branches
    + Number of changed LOC by PR (Bug/engineer/weeks)
    + Number of files by PR (Bugzilla Bug)
    + Changes by files
    - Get Real name of submitter with link to User page - ToDO
    - IFD (Inspection Faults Density) by comments number - ToDO

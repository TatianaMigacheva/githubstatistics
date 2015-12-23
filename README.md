# GitHub statistics
===================================

This program is intend to gather some statistics info from any GitHub project.


The results of this program is downloaded into csv files:


1) PR Statistics


    ["number", "state", "title", "created_at", "closed_at", 
    "merged_at", "author", "target_branch", "bug_number", "files_changed", 
    "loc_added", "loc_deleted", "loc_changed"];
2) Files Statistics


    ["filename", "additions", "deletions", "changes", "PR_number"];


These csv files can be used for generation the following reports by means of Excel:


    - PRs (Bugzilla Bugs) submitted by engineer ("PR Statistics")
    - Duration of peer review (graphics by weeks/by engineer) ("PR Statistics")
    - PRs by branches ("PR Statistics")
    - Number of changed LOC by PR (Bug/engineer/weeks) ("PR Statistics")
    - Number of files by PR (Bugzilla Bug) ("PR Statistics")
    - Changes by files ("Files Statistics") 
    - Get Real name of submitter with link to User page - ToDO (not implemented) ("PR Statistics")
    - IFD (Inspection Faults Density) by comments number - ToDO (not implemented)


Usage:


For running the script it's needed to set "token" variable (personal GitHub token)

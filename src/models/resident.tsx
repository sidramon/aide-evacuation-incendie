export class Resident {
    name: string;
    roomNumber: string;
    colorCode: string;
    issues: number[]; // Array to store issue numbers (e.g., [1, 3], [4], etc.)
    additionalDetails: string;

    constructor(
        name: string,
        roomNumber: string,
        colorCode: string,
        issues: number[] = [],
        additionalDetails: string = ""
    ) {
        this.name = name;
        this.roomNumber = roomNumber;
        this.colorCode = colorCode;
        this.issues = issues;
        this.additionalDetails = additionalDetails;
    }

    // Method to add an issue
    addIssue(issue: number): void {
        if (!this.issues.includes(issue)) {
            this.issues.push(issue);
        }
    }

    // Method to remove an issue
    removeIssue(issue: number): void {
        this.issues = this.issues.filter((i) => i !== issue);
    }

    // Method to clear all issues
    clearIssues(): void {
        this.issues = [];
    }
}
export const eventPublishedColumns = [
    {
        header: "Event Title",
        accessor: "Title", // Maps to the `Title` field in data
    },
    {
        header: "Date",
        accessor: "Date", // Maps to the `Date` field in data
    },
    {
        header: "Event Category",
        accessor: "Category", // Maps to the `Category` field in data
    },
    {
        header: "Event Date",
        accessor: "EventDate", // Maps to the `EventDate` field in data
    },
    {
        header: "Event Type",
        accessor: "Type", // Maps to the `Type` field in data
    },
    {
        header: "Member(s)",
        accessor: "Members", // Maps to the `Members` field in data
        Cell: (row: any) => row.Members.join(", "), // Custom rendering logic for member list
    },
];

export const eventDraftedColumns = [
    {
        header: "Event Title",
        accessor: "Title", // Maps to the `Title` field in data
    },
    {
        header: "Date",
        accessor: "Date", // Maps to the `Date` field in data
    },
    {
        header: "Event Category",
        accessor: "Category", // Maps to the `Category` field in data
    },
    {
        header: "Event Date",
        accessor: "EventDate", // Maps to the `EventDate` field in data
    },
    {
        header: "Event Type",
        accessor: "Type", // Maps to the `Type` field in data
    },
    {
        header: "Member(s)",
        accessor: "Members", // Maps to the `Members` field in data
        Cell: (row: any) => row.Members.join(", "), // Custom rendering logic for member list
    },
    {
        header: "",
        accessor: "",
        Cell: () => (
            <button
                className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light3 hover:text-primary`}
            >
                Publish
            </button>
        ),
    },
];

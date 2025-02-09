export const eventPublishedColumns = [
    {
        header: "Event Title",
        accessor: "post_title",
    },
    {
        header: "Date",
        accessor: "post_date",
        Cell: ({ value }: { value: any }) => {
            if (!value) return '';

            const date = new Date(value);
            const formattedDate = date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            return formattedDate;
        }
    },
    {
        header: "Event Category",
        accessor: "categories",
    },
    {
        header: "Event Date",
        accessor: "_EventStartDate",
        Cell: ({ value }: { value: any }) => {
            if (!value || !value[0]) return '';

            const date = new Date(value[0]);
            const formattedDate = date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            return formattedDate;
        }
    },
    {
        header: "Event Type",
        accessor: "post_type",
    },
    {
        header: "Member(s)",
        accessor: "Members",
        Cell: (row: { Members: any[]; }) => row?.Members?.join(", "),
    },
    {
        header: "Action",
        accessor: "View Details",
    },
    {
        header: "View Reviews",
        accessor: "View Reviews",
    },
];


export const eventDraftedColumns = [
    {
        header: "Event Title",
        accessor: "post_title", // Maps to the `Title` field in data
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
        accessor: "post_date", // Maps to the `EventDate` field in data
    },
    {
        header: "Event Type",
        accessor: "post_type", // Maps to the `Type` field in data
    },
    {
        header: "Member(s)",
        accessor: "Members", // Maps to the `Members` field in data
        Cell: (row: any) => row?.Members?.join(", "), // Custom rendering logic for member list
    },
    {
        header: "Actions",
        accessor: "Publish",
    },
    {
        header: "Action",
        accessor: "View Details",
    },
];
export const navigatiorColumn = [
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
        Cell: (row: any) => row.Members?.join(", "), // Custom rendering logic for member list
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
    {
        header: "111",
        accessor: "111",
        Cell: () => (
            <td className="px-4 py-3 text-center">
                <button
                    // onClick={() => onViewDetails(row)}
                    className={`bg-primary  px-4 py-2 rounded-md hover:bg-primary-light3 hover:text-primary text-white  transition-colors`}
                >
                    View Details
                </button>
            </td>
        ),
    },
];




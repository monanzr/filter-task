import React, { useContext, useCallback } from "react";
import { Fragment } from "react";
import { Table } from "flowbite-react";
import DataContext from "../context/DataProvider";

function DataList() {
  const {
    task,
    user,
    searchState,
    dispatchSearch,
    isBooleanState,
    dispatchIsBoolean,
    filterState,
  } = useContext(DataContext);

  const updatedTaskObj = task.map((task) => {
    const names = task["assignee id"].map((assigneeId) => {
      const { name } = user.find((user) => user.id === assigneeId);
      return name;
    });
    return { ...task, names };
  });

  const filteredTasks =
    filterState.selectedFilteredSubDropdown.length > 0
      ? updatedTaskObj.filter(
          (task) =>
            filterState.selectedFilteredSubDropdown.includes(task.label) ||
            filterState.selectedFilteredSubDropdown.includes(task.priorities) ||
            task.names.some((name) =>
              filterState.selectedFilteredSubDropdown.includes(name)
            )
        )
      : updatedTaskObj;

  const searchFilter = filteredTasks.filter((task) =>
    task.description.toLocaleLowerCase().includes(searchState.descriptionSearch)
  );

  const searchContentHandler = (event) =>
  {
    dispatchSearch({
      type: "DESCRIPTION_SEARCH",
      value: event.target.value,
    });
  } 

  const closeSearch = useCallback(() =>
    dispatchIsBoolean({
      type: "SET_ISVISIBLE",
      isValid: false,
    }),[]);

  return (
    <Fragment>
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Task name</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Priorities</Table.HeadCell>
          <Table.HeadCell>Label</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Assignee</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {filteredTasks.map((item) => (
            <Table.Row
              key={item["assignee id"]}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {item["task name"]}
              </Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>{item.date}</Table.Cell>
              <Table.Cell>{item.priorities}</Table.Cell>
              <Table.Cell>{item.label}</Table.Cell>
              <Table.Cell>
                {item.names.map((i, idx) => (
                  <span className="mx-2" key={idx}>
                    {i}
                  </span>
                ))}
              </Table.Cell>
            </Table.Row>
          )) &&
            searchFilter.map((item) => (
              <Table.Row
                key={item["assignee id"]}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item["task name"]}
                </Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>{item.priorities}</Table.Cell>
                <Table.Cell>{item.label}</Table.Cell>
                <Table.Cell>
                  {item.names.map((i, idx) => (
                    <span className="mx-2" key={idx}>
                      {i}
                    </span>
                  ))}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {isBooleanState.isVisible ? (
        <div className="rounded-md border-gray-300 w-fit p-4 my-8 mx-auto shadow-xl shadow-gray-300 grid gap-2 justify-items-end">
          <button onClick={closeSearch}>
            {" "}
            <svg
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <input
            onChange={searchContentHandler}
            type="text"
            placeholder="Search..."
            className="border-none focus:shadow-[0_0_rgba(0,0,0/0%)] p-2 w-full bg-gray-100 rounded-md"
          />
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
}

export default DataList;

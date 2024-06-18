import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckMini,
  EllipsisHorizontal,
  Trash,
  XMarkMini,
} from "@medusajs/icons";
import {
  Badge,
  DropdownMenu,
  IconButton,
  Table,
  Tooltip,
  usePrompt,
} from "@medusajs/ui";
import {
  useApproveVendor,
  useDeleteVendor,
  useRejectVendor,
  useSuspendVendor,
  useVendorSearch,
  useVendors,
} from "../../services/vendors";

type Props = {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

function VendorTable({ onSuccess, onError }: Props) {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const cursor = searchParams.get("cursor") || null;
  const search = searchParams.get("q") || "";

  const [currentPage, setCurrentPage] = useState(0);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);

  const dialog = usePrompt();

  const { data, isLoading } = useVendors(cursor);
  const { data: searchData, isLoading: searchIsLoading } = useVendorSearch(
    search,
    {
      enabled: !!search,
    }
  );
  const { mutateAsync: deleteVendor } = useDeleteVendor();
  const { mutateAsync: approveVendor } = useApproveVendor();
  const { mutateAsync: suspendVendor } = useSuspendVendor();
  const { mutateAsync: rejectVendor } = useRejectVendor();

  // useEffect(() => {
  //   if (cursor !== data?.cursor) {
  //     setSearchParams({ cursor: data?.cursor });
  //   }
  // }, [cursor, data, setSearchParams]);

  if (isLoading || (search && searchIsLoading)) {
    return <div>Loading...</div>;
  }

  if (!data || (search && !searchData?.length)) {
    return <div>No Data</div>;
  }

  const deleteHandler = async (id: string) => {
    const hasConfirmed = await dialog({
      title: "Delete Vendor",
      description:
        "Are you sure you want to do this? Once deleted, all products created by this vendor will be removed as well.",
    });

    if (hasConfirmed) {
      try {
        const response = await deleteVendor(id);

        if (response) {
          onSuccess("Successfully deleted vendor");
        }
      } catch (error) {
        if (error instanceof Error) {
          onError(error.message);
        }
      }
    }
  };

  const approveHandler = async (id: string) => {
    const hasConfirmed = await dialog({
      title: "Approve Vendor",
      description: "Are you sure you want to do this?",
      variant: "confirmation",
    });

    if (hasConfirmed) {
      try {
        const response = await approveVendor(id);

        if (response) {
          onSuccess("Successfully approved vendor");
        }
      } catch (error) {
        if (error instanceof Error) {
          onError(error.message);
        }
      }
    }
  };

  const rejectHandler = async (id: string) => {
    const hasConfirmed = await dialog({
      title: "Reject Vendor",
      description: "Are you sure you want to do this?",
    });

    if (hasConfirmed) {
      try {
        const response = await rejectVendor(id);

        if (response) {
          onSuccess("Successfully rejected vendor");
        }
      } catch (error) {
        if (error instanceof Error) {
          onError(error.message);
        }
      }
    }
  };

  const suspendHandler = async (id: string) => {
    const hasConfirmed = await dialog({
      title: "Suspend Vendor",
      description: "Are you sure you want to do this?",
    });

    if (hasConfirmed) {
      try {
        const response = await suspendVendor(id);

        if (response) {
          onSuccess("Successfully suspended vendor");
        }
      } catch (error) {
        if (error instanceof Error) {
          onError(error.message);
        }
      }
    }
  };

  const canPreviousPage = currentPage > 1;
  const canNextPage = !!data?.cursor;
  const pageCount = (searchData || data?.vendors).length
    ? Math.ceil(data.vendors.length / 10)
    : 1;

  const previousPage = () => {
    if (!canPreviousPage) return;
    const prevCursor = cursorHistory.pop();
    setSearchParams({ cursor: prevCursor });
    setCurrentPage((page) => page - 1);
  };

  const nextPage = () => {
    if (!canNextPage) return;

    const currentCursor = searchData.slice(-1)[0].id || data?.cursor;
    setCursorHistory((prev) => [...prev, currentCursor]);
    setSearchParams({ cursor: currentCursor });
    setCurrentPage((page) => page + 1);
  };

  return (
    <div className="[&_th]:whitespace-nowrap [&_td]:whitespace-nowrap w-full !overflow-x-auto">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Store Name</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Phone Number</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body className="w-full !overflow-x-auto">
          {(searchData || data?.vendors)?.map((vendor, index) => {
            return (
              <Table.Row
                key={index}
                className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap cursor-pointer"
                onClick={() => navigate(`./${vendor.id}`)}
              >
                <Table.Cell className="flex gap-3 items-center">
                  {vendor.vendorType === 0 ? (
                    <Tooltip content="Tiq Individual">
                      <Badge size="2xsmall" color="grey">
                        I
                      </Badge>
                    </Tooltip>
                  ) : (
                    vendor.vendorType === 1 && (
                      <Tooltip content="Tiq Business">
                        <Badge size="2xsmall" color="grey">
                          B
                        </Badge>
                      </Tooltip>
                    )
                  )}
                  {vendor.storeName}
                </Table.Cell>
                <Table.Cell>
                  <span>{vendor.firstName}</span> <span>{vendor.lastName}</span>
                </Table.Cell>
                <Table.Cell>{vendor.email}</Table.Cell>
                <Table.Cell>{vendor.phoneNumber}</Table.Cell>
                <Table.Cell>
                  {vendor.status === 0 ? (
                    <Badge size="2xsmall" color="orange">
                      Processing
                    </Badge>
                  ) : vendor.status === 1 ? (
                    <Badge size="2xsmall" color="green">
                      Approved
                    </Badge>
                  ) : (
                    vendor.status === 2 && (
                      <Badge size="2xsmall" color="red">
                        Rejected
                      </Badge>
                    )
                  )}
                </Table.Cell>
                <Table.Cell>
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <IconButton variant="transparent">
                        <EllipsisHorizontal />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      {![1, 2].includes(vendor.status) && (
                        <>
                          <DropdownMenu.Item
                            className="gap-x-2"
                            onClick={async (e) => {
                              approveHandler(vendor.id);
                              e.stopPropagation();
                            }}
                          >
                            <CheckMini className="text-ui-fg-subtle" />
                            Approve
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="gap-x-2"
                            onClick={async (e) => {
                              rejectHandler(vendor.id);
                              e.stopPropagation();
                            }}
                          >
                            <XMarkMini className="text-ui-fg-subtle" />
                            Reject
                          </DropdownMenu.Item>
                        </>
                      )}
                      <DropdownMenu.Item
                        className="gap-x-2"
                        onClick={async (e) => {
                          deleteHandler(vendor.id);
                          e.stopPropagation();
                        }}
                      >
                        <Trash className="text-ui-fg-subtle" />
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <Table.Pagination
        count={(searchData || data?.vendors).length}
        pageSize={10}
        pageIndex={currentPage}
        pageCount={pageCount}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </div>
  );
}

export default VendorTable;

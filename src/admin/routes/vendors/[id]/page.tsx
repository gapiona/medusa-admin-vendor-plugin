import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Container,
  Prompt,
  Text,
  Tooltip,
} from "@medusajs/ui";
import { ArrowLeft, XMark } from "@medusajs/icons";
import { useVendorDetails } from "../../../services/vendors";

const VendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewModal, setPreviewModal] = useState<{
    open: boolean;
    type: "pdf" | "image" | null;
    data: string | null;
  }>({
    open: false,
    type: null,
    data: null,
  });

  const { isLoading, data: vendor } = useVendorDetails(id || "");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!vendor) {
    return <div>Vendor Not Found</div>;
  }

  const cac = vendor.incorporationDocumentURL;
  const proofOfAddress = vendor.addressProofURL;

  return (
    <>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="px-2 w-fit"
        >
          <Text
            className="gap-x-2 flex items-center text-gray-500"
            weight="plus"
          >
            <ArrowLeft />
            <span>Back to Vendors</span>
          </Text>
        </button>
        <Container className="flex flex-col gap-6">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                src="https://image-url.com/john-doe"
                fallback={
                  vendor.firstName.charAt(0) + vendor.lastName.charAt(0)
                }
                className="size-16 text-xl"
              />
              <div className={"flex flex-col grow"}>
                <div className="flex items-start gap-4">
                  <Text weight="plus" className="capitalize text-2xl">
                    <span>{vendor.storeName}</span>
                  </Text>
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
                </div>
                <Text className="text-gray-500" size="small">
                  {vendor.email}
                </Text>
              </div>
            </div>
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
          </div>
          <div className="flex flex-col divide-y">
            <div className="flex divide-x flex-wrap pb-6">
              <div className="flex flex-col items-start gap-0.5 p-2 pl-0 pr-6">
                <Text size="small" className="text-gray-400">
                  First Name
                </Text>
                <Text size="small" className="text-gray-950">
                  {vendor.firstName}
                </Text>
              </div>
              <div className="flex flex-col items-start gap-0.5 p-2 px-6">
                <Text size="small" className="text-gray-400">
                  Last Name
                </Text>
                <Text size="small" className="text-gray-950">
                  {vendor.lastName}
                </Text>
              </div>
              <div className="flex flex-col items-start gap-0.5 p-2 px-6">
                <Text size="small" className="text-gray-400">
                  Email
                </Text>
                <Text size="small" className="text-gray-950">
                  {vendor.email}
                </Text>
              </div>
              <div className="flex flex-col items-start gap-0.5 p-2 px-6">
                <Text size="small" className="text-gray-400">
                  Address
                </Text>
                <Text size="small" className="text-gray-950">
                  {vendor.address}
                </Text>
              </div>
              <div className="flex flex-col items-start gap-0.5 p-2 px-6">
                <Text size="small" className="text-gray-400">
                  NIN
                </Text>
                <Text size="small" className="text-gray-950">
                  {vendor.NIN}
                </Text>
              </div>
            </div>
            <div className="flex gap-8">
              {cac && (
                <div className="flex flex-col gap-2 py-6">
                  <Text size="base" weight="plus">
                    CAC
                  </Text>
                  {cac.endsWith(".pdf") ? (
                    <Button
                      onClick={() => {
                        setPreviewModal({
                          open: true,
                          type: "pdf",
                          data: cac,
                        });
                      }}
                      size="small"
                      variant="secondary"
                    >
                      View PDF
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setPreviewModal({
                          open: true,
                          type: "image",
                          data: cac,
                        });
                      }}
                      size="small"
                      variant="secondary"
                    >
                      View Image
                    </Button>
                  )}
                </div>
              )}
              {proofOfAddress && (
                <div className="flex flex-col gap-2 py-6">
                  <Text size="base" weight="plus">
                    Proof of Address
                  </Text>
                  {proofOfAddress.endsWith(".pdf") ? (
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => {
                        setPreviewModal({
                          open: true,
                          type: "pdf",
                          data: proofOfAddress,
                        });
                      }}
                    >
                      View PDF
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setPreviewModal({
                          open: true,
                          type: "image",
                          data: proofOfAddress,
                        });
                      }}
                      size="small"
                      variant="secondary"
                    >
                      View Image
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
      <Prompt
        open={previewModal.open}
        onOpenChange={(bool) =>
          setPreviewModal({
            open: bool,
            type: null,
            data: null,
          })
        }
      >
        <Prompt.Content className="max-w-[700px] max-h-[90%] p-4 flex flex-col gap-4">
          <div className="ml-auto">
            <Prompt.Cancel>
              <XMark className="!text-xs" />
            </Prompt.Cancel>
          </div>
          {previewModal.type === "image" ? (
            <figure className="h-[500px] aspect-square">
              <img
                src={previewModal.data}
                alt="proof of address"
                className="w-full h-full object-contain"
              />
            </figure>
          ) : (
            previewModal.type === "pdf" && (
              <object
                data={previewModal.data}
                type="application/pdf"
                width="100%"
                height="500px"
              >
                <p>
                  Error occurred while loading PDF. Check out the PDF
                  <a href={previewModal.data}>here!</a>
                </p>
              </object>
            )
          )}
        </Prompt.Content>
      </Prompt>
    </>
  );
};

export default VendorDetail;

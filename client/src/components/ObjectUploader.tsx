// Reference: blueprint:javascript_object_storage
import { useState } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  uploadEndpoint: string;
  onComplete?: (objectPath: string) => void;
  buttonClassName?: string;
  children: ReactNode;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 52428800, // 50MB default
  uploadEndpoint,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
        allowedFileTypes: ['audio/*', '.mp3', '.wav', '.ogg'],
      },
      autoProceed: false,
    })
      .use(XHRUpload, {
        endpoint: uploadEndpoint,
        method: 'POST',
        formData: false,
        headers: {
          'Content-Type': 'audio/mpeg',
        },
        getResponseData: (xhr: XMLHttpRequest) => {
          const response = JSON.parse(xhr.responseText);
          return {
            url: response.objectPath,
          };
        },
      })
      .on("complete", (result) => {
        if (result.successful && result.successful.length > 0) {
          const response = result.successful[0].response as any;
          onComplete?.(response.body.objectPath || response.uploadURL);
        }
      })
  );

  return (
    <div>
      <Button onClick={() => setShowModal(true)} className={buttonClassName} data-testid="button-upload">
        {children}
      </Button>

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
}

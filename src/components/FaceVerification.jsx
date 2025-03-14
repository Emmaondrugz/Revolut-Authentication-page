'use client'
import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Center, Flex, Text, Alert} from "@chakra-ui/react";
import { Camera } from "react-camera-pro";
import { useRouter } from "next/navigation";

export default function FaceVerification() {
  const router = useRouter();
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const capture = () => {
    try {
      const imageSrc = camera.current.takePhoto();
      rotateImage(imageSrc, 90, (rotatedImage) => {
        setImage(rotatedImage);
        localStorage.setItem('faceCapture', rotatedImage);
        router.push("/verification-result");
      });
    } catch (error) {
      setCameraError("Failed to capture image. Please try again.");
    }
  };

  const rotateImage = (imageBase64, rotation, callback) => {
    const img = new Image();
    img.src = imageBase64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
      callback(canvas.toDataURL("image/jpeg"));
    };
  };

  return (
    <Box h="100vh" w="100vw" bg="gray.800" position="relative">
      <Flex direction="column" h="full" justify="space-between">
        {/* Header */}
        <Flex p={4} align="center" bg="blackAlpha.600">
          <Button variant="ghost" color="white" onClick={() => router.back()}>
            Back
          </Button>
          <Text flex={1} textAlign="center" color="white" fontSize="lg">
            Face Verification
          </Text>
        </Flex>

        {/* Camera Preview */}
        <Center flex={1} position="relative" overflow="hidden">
          <Box
            position="absolute"
            w="full"
            h="full"
            sx={{
              '& > div': {
                width: '100% !important',
                height: '100% !important',
              }
            }}
          >
            <Camera
              ref={camera}
              errorMessages={{
                noCameraAccessible: 'Camera access denied. Please enable permissions.',
                permissionDenied: 'Camera permission denied.',
                switchCamera: 'Camera switch failed.',
                canvas: 'Camera rendering error.'
              }}
              facingMode="user"
              aspectRatio={9 / 16}
            />
          </Box>

          {/* Overlay */}
          <Box
            position="absolute"
            w="80%"
            h="60%"
            border="4px"
            borderColor="whiteAlpha.500"
            borderRadius="full"
            boxShadow="inner"
            sx={{
              clipPath: 'ellipse(50% 40% at 50% 50%)'
            }}
          />
        </Center>

        {/* Controls */}
        <Flex p={6} direction="column" align="center" bg="blackAlpha.600">
          {cameraError && (
            <Alert status="error" mb={4} borderRadius="md">
              <Alert.Icon />
              {cameraError}
            </Alert>
          )}

          <Button
            colorScheme="blue"
            size="lg"
            borderRadius="full"
            w="60px"
            h="60px"
            onClick={capture}
            boxShadow="xl"
            _active={{ transform: 'scale(0.95)' }}
          >
            📸
          </Button>

          <Text mt={4} color="whiteAlpha.800" textAlign="center">
            Position your face within the oval
            <br />
            Ensure good lighting and remove accessories
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}

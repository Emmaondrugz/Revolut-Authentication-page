'use client'
import { Box, Button, Center, Flex, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function VerificationResult() {
  const router = useRouter();
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    const savedPhoto = localStorage.getItem('faceCapture');
    if (savedPhoto) {
      setPhoto(savedPhoto);
    } else {
      router.push("/face-verification");
    }
  }, []);

  return (
    <Box h="100vh" w="100vw" bg="gray.800">
      <Flex direction="column" h="full" justify="space-between">
        <Center flex={1} p={4}>
          <Image
            src={photo}
            alt="Verification result"
            borderRadius="lg"
            boxShadow="xl"
            maxW="90%"
            maxH="70vh"
            objectFit="contain"
          />
        </Flex>

        <Flex p={6} direction="column" gap={4} bg="blackAlpha.600">
          <Button
            colorScheme="blue"
            onClick={() => router.push("/face-verification")}
          >
            Retake Photo
          </Button>
          <Button
            colorScheme="green"
            onClick={() => router.push("/success")}
          >
            Submit Verification
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

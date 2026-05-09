"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import ChakraProviders from "../ChakraProviders";

const navItems = [
  { href: "/", label: "Landing" },
  { href: "/features", label: "Features" },
  { href: "/philosophy", label: "Philosophy" },
];

export default function MarketingShell({ children }) {
  const pathname = usePathname();

  return (
    <ChakraProviders>
      <Box minH="100vh" bg="#0A0A0A" color="white">
        <Box
          as="header"
          position="fixed"
          top="0"
          insetX="0"
          zIndex="20"
          bg="rgba(10, 10, 10, 0.88)"
          borderBottom="1px solid rgba(204, 255, 0, 0.12)"
          backdropFilter="blur(18px)"
        >
          <Container maxW="6xl">
            <Flex h="76px" align="center" justify="space-between" gap={4}>
              <HStack spacing={3} flexShrink={0}>
                <Box
                  w="11"
                  h="11"
                  border="1px solid #CCFF00"
                  display="grid"
                  placeItems="center"
                >
                  <Box w="3" h="3" bg="#CCFF00" />
                </Box>
                <Box>
                  <Text
                    fontFamily="var(--font-lexend)"
                    fontSize="sm"
                    letterSpacing="0.22em"
                    textTransform="uppercase"
                  >
                    IRON PULSE
                  </Text>
                  <Text fontSize="10px" letterSpacing="0.22em" color="gray.500">
                    GYM MANAGEMENT SYSTEM
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={8} display={{ base: "none", md: "flex" }}>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      as={NextLink}
                      href={item.href}
                      fontSize="sm"
                      letterSpacing="0.12em"
                      textTransform="uppercase"
                      color={isActive ? "white" : "gray.400"}
                      _hover={{ color: "#CCFF00", textDecoration: "none" }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </HStack>

              <Button
                as={NextLink}
                href="/account-type"
                size="sm"
                bg="#CCFF00"
                color="#0A0A0A"
                borderRadius="999px"
                fontFamily="var(--font-lexend)"
                letterSpacing="0.14em"
                textTransform="uppercase"
                _hover={{ bg: "#d9ff33" }}
              >
                Join Now
              </Button>
            </Flex>
          </Container>
        </Box>

        <Box pt="112px" pb="72px">
          {children}
        </Box>
      </Box>
    </ChakraProviders>
  );
}

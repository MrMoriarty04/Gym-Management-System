"use client";
import { useRouter } from "next/navigation";
import { 
  Box, Flex, Text, Heading, Grid, Button, VStack, HStack, Icon, Divider, Center
} from "@chakra-ui/react";
import { FiCheck, FiX, FiShield, FiXCircle, FiHeadphones } from "react-icons/fi";

const plans = [
  {
    months: 1,
    title: "1-MONTH",
    price: "99",
    billing: "Billed monthly. Auto-renews.",
    highlight: false,
    features: [
      { text: "24/7 Facility Access", active: true },
      { text: "Standard Equipment", active: true },
      { text: "IRON_CORE_CMS App", active: false },
    ]
  },
  {
    months: 3,
    title: "3-MONTH",
    price: "89",
    billing: "Billed $267 quarterly.",
    highlight: false,
    features: [
      { text: "24/7 Facility Access", active: true },
      { text: "Elite Equipment", active: true },
      { text: "IRON_CORE_CMS App", active: true },
    ]
  },
  {
    months: 12,
    title: "12-MONTH",
    price: "69",
    billing: "Billed $828 annually.",
    highlight: true,
    badge: "BEST VALUE",
    features: [
      { text: "24/7 Facility Access", active: true },
      { text: "Elite Equipment Priority", active: true },
      { text: "IRON_CORE_CMS Premium", active: true },
      { text: "1x Monthly Coaching", active: true },
    ]
  },
  {
    months: 6,
    title: "6-MONTH",
    price: "79",
    billing: "Billed $474 semi-annually.",
    highlight: false,
    features: [
      { text: "24/7 Facility Access", active: true },
      { text: "Elite Equipment", active: true },
      { text: "IRON_CORE_CMS App", active: true },
      { text: "Monthly Coaching", active: false },
    ]
  }
];

export default function ChoosePlanPage() {
  const router = useRouter();

  const handleSelectPlan = (planMonths) => {
    router.push(`/payment?plan=${planMonths}`);
  };

  return (
    <Box bg="#111" minH="100vh" color="white" py={20} px={6}>
      
      <VStack spacing={4} textAlign="center" mb={16}>
        <Heading fontSize={{ base: "3xl", md: "5xl" }} letterSpacing="widest" textTransform="uppercase">
          FORGED THROUGH <Text as="span" color="#ccff00">DISCIPLINE</Text>
        </Heading>
        <Text color="gray.400" maxW="2xl" fontSize="sm">
          Select your operational duration. High-intensity infrastructure requires serious
          commitment. Choose the tier that aligns with your mission objectives.
        </Text>
      </VStack>

      <Center>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} maxW="7xl" w="full" alignItems="center">
          {plans.map((plan, index) => (
            <Box 
              key={index} 
              bg="#1a1a1a" 
              borderRadius="xl" 
              border="2px solid"
              borderColor={plan.highlight ? "#ccff00" : "#2a2a2a"}
              p={8}
              position="relative"
              transform={plan.highlight ? "scale(1.05)" : "none"}
              zIndex={plan.highlight ? 2 : 1}
              boxShadow={plan.highlight ? "0 0 20px rgba(204, 255, 0, 0.1)" : "none"}
            >
              {plan.highlight && (
                <Badge bg="#ccff00" color="black" position="absolute" top="-12px" left="50%" transform="translateX(-50%)" px={4} py={1} borderRadius="full" fontSize="xs" fontWeight="bold">
                  {plan.badge}
                </Badge>
              )}

              <Text fontSize="sm" fontWeight="bold" letterSpacing="widest" mb={2}>{plan.title}</Text>
              <Flex align="baseline" mb={2}>
                <Text fontSize="4xl" fontWeight="black" mr={1}>${plan.price}</Text>
                <Text fontSize="xs" color="gray.500">/MO</Text>
              </Flex>
              <Text fontSize="xs" color="gray.500" mb={8} h="20px">{plan.billing}</Text>

              <VStack align="stretch" spacing={4} mb={10}>
                {plan.features.map((feature, idx) => (
                  <HStack key={idx} spacing={3} opacity={feature.active ? 1 : 0.4}>
                    <Icon as={feature.active ? FiCheck : FiX} color={feature.active ? "#ccff00" : "gray.500"} />
                    <Text fontSize="sm" color={feature.active ? "white" : "gray.500"}>{feature.text}</Text>
                  </HStack>
                ))}
              </VStack>

              <Button 
                w="full" 
                bg={plan.highlight ? "#ccff00" : "transparent"} 
                color={plan.highlight ? "black" : "white"}
                border="1px solid"
                borderColor={plan.highlight ? "#ccff00" : "#333"}
                _hover={{ bg: plan.highlight ? "#b3e600" : "rgba(255,255,255,0.05)" }}
                onClick={() => handleSelectPlan(plan.months)}
                fontSize="sm"
                letterSpacing="widest"
              >
                SELECT PLAN
              </Button>
            </Box>
          ))}
        </Grid>
      </Center>

      <Box mt={24} maxW="5xl" mx="auto">
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} textAlign="center">
          <VStack>
            <Icon as={FiShield} fontSize="2xl" color="white" mb={2} />
            <Text fontSize="sm" fontWeight="bold">SECURE PAYMENTS</Text>
            <Text fontSize="xs" color="gray.500">Encrypted transactions via terminal standard protocols.</Text>
          </VStack>
          <VStack>
            <Icon as={FiXCircle} fontSize="2xl" color="white" mb={2} />
            <Text fontSize="sm" fontWeight="bold">NO HIDDEN FEES</Text>
            <Text fontSize="xs" color="gray.500">Transparent pricing structure. Zero initiation costs today.</Text>
          </VStack>
          <VStack>
            <Icon as={FiHeadphones} fontSize="2xl" color="white" mb={2} />
            <Text fontSize="sm" fontWeight="bold">24/7 SUPPORT</Text>
            <Text fontSize="xs" color="gray.500">Access to terminal support staff via the CMS network.</Text>
          </VStack>
        </Grid>
      </Box>
      
    </Box>
  );
}

const Badge = ({ children, ...props }) => <Box {...props}>{children}</Box>;
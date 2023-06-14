import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	Icon,
	useToast,
} from "@chakra-ui/react";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useState } from "react";
import { InfoIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useRegisterMutation } from "../features/auth/authApiSlice";

import { z, ZodError } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z
	.object({
		username: z
			.string()
			.min(3, {
				message: "Името трябва да е поне 3 символа",
			})
			.max(50, {
				message: "Името трябва да е най-много 50 символа",
			}),
		password: z
			.string()
			.min(8, {
				message: "Паролата трябва да е поне 8 символа",
			})
			// .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
			// 	message:
			// 		"Паролата трябва да съдържа поне една малка буква, една главна буква и една цифра",
			// })
			.max(50, {
				message: "Паролата трябва да е най-много 50 символа",
			}),
		confirmPassword: z
			.string()
			.min(8, {
				message: "Паролата трябва да е поне 8 символа",
			})
			// .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
			// 	message:
			// 		"Паролата трябва да съдържа поне една малка буква, една главна буква и една цифра",
			// })
			.max(50, {
				message: "Паролата трябва да е най-много 50 символа",
			}),
	})
	.refine((data: any) => data.password === data.confirmPassword, {
		message: "Паролите не съвпадат",
		path: ["confirmPassword"],
	});

type SignUpFormInputs = z.infer<typeof schema>;

export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);

	const toast = useToast();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpFormInputs>({
		resolver: zodResolver(schema),
	});

	const [registerUser, { isLoading }] = useRegisterMutation();

	const onSubmit = handleSubmit(async (data) => {
		try {
			await registerUser({
				username: data.username,
				password: data.password,
			});
			toast({
				title: "Успешна регистрация",
				description: "Вече можете да влезете в акаунта си",
				status: "success",
				duration: 9000,
				isClosable: true,
			});
			navigate("/sign-in");
		} catch (error) {
			if (error instanceof ZodError) {
				console.log(error);
			}
			toast({
				title: "Грешка",
				description: "Възникна грешка при регистрацията",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		}
	});

	return (
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Stack
				spacing={8}
				mx={"auto"}
				py={12}
				px={6}
				maxW={"lg"}
				w={"full"}
			>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Регистрирай се
					</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						за да започнеш да използваш приложението
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Stack spacing={4}>
						<form onSubmit={onSubmit}>
							<FormControl isInvalid={Boolean(errors.username)}>
								<FormLabel>Потребителско Име</FormLabel>
								<Input
									id="name"
									{...register("username", {
										required: "Името е задължително",
									})}
								/>
								<FormErrorMessage>
									<Icon as={InfoIcon} color="red.500" />
									{errors.username?.message as string}
								</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={Boolean(errors.password)}>
								<FormLabel>Парола</FormLabel>
								<InputGroup>
									<Input
										id="password"
										type={
											showPassword ? "text" : "password"
										}
										{...register("password", {
											required: "Паролата е задължителна",
										})}
									/>
									<InputRightElement h={"full"}>
										<Button
											variant={"ghost"}
											onClick={() =>
												setShowPassword(
													(showPassword) =>
														!showPassword
												)
											}
										>
											{showPassword ? (
												<ViewIcon />
											) : (
												<ViewOffIcon />
											)}
										</Button>
									</InputRightElement>
								</InputGroup>
								<FormErrorMessage>
									<Icon as={InfoIcon} color="red.500" />
									{errors.password?.message as string}
								</FormErrorMessage>
							</FormControl>
							<FormControl
								isInvalid={Boolean(errors.confirmPassword)}
							>
								<FormLabel>Потвърди паролата</FormLabel>
								<Input
									id="confirmPassword"
									type={showPassword ? "text" : "password"}
									{...register("confirmPassword", {
										required: "Паролата е задължителна",
									})}
								/>
								<FormErrorMessage>
									<Icon as={InfoIcon} color="red.500" />
									{errors.confirmPassword?.message as string}
								</FormErrorMessage>
							</FormControl>
							<Text fontSize="sm" color="gray.500" mt={2}>
								Регистрирайки се, се съгласявам с {` `}
								<Link
									as={RouterLink}
									to="/terms-and-conditions"
									color="blue.500"
								>
									общите условия
								</Link>{" "}
								и{` `}
								<Link
									as={RouterLink}
									to="/privacy-policy"
									color="blue.500"
								>
									политиката на поверителност
								</Link>
								.
							</Text>
							<Stack spacing={10} pt={2}>
								<Button
									loadingText="Submitting"
									isLoading={isLoading}
									isDisabled={isSubmitting}
									type="submit"
									size="lg"
									bg={"blue.400"}
									color={"white"}
									_hover={{
										bg: "blue.500",
									}}
								>
									Регистрация
								</Button>
							</Stack>
							<Stack pt={6}>
								<Text align={"center"}>
									Имате акаунт?{" "}
									<Link
										color={"blue.400"}
										as={RouterLink}
										to="/sign-in"
									>
										Влезте в него
									</Link>
								</Text>
							</Stack>
						</form>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}

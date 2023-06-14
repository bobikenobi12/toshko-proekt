import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Heading,
	InputGroup,
	InputRightElement,
	Input,
	Stack,
	useToast,
	Icon,
	Link,
} from "@chakra-ui/react";

import { useState } from "react";

import { useNavigate, Link as RouterLink } from "react-router-dom";

import { InfoIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useLoginMutation } from "../features/auth/authApiSlice";

import { z, ZodError } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z.object({
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
});

type SignInFormInputs = z.infer<typeof schema>;

export default function SignInPage() {
	const navigate = useNavigate();
	const toast = useToast();

	const [showPassword, setShowPassword] = useState(false);

	const [login, { isLoading }] = useLoginMutation();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormInputs>({
		resolver: zodResolver(schema),
	});

	const onSubmit = handleSubmit(async (data) => {
		try {
			await login(data).unwrap();
			toast({
				title: "Успешен вход",
				description: "Вие влязохте успешно в акаунта си.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
			navigate("/");
		} catch (err) {
			if (err instanceof ZodError) {
				toast({
					title: "Грешка при вход",
					description: err.issues[0].message,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			} else {
				toast({
					title: "Грешка при вход",
					description: "Възникна грешка при вход",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		}
	});

	return (
		<Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
			<Flex p={8} flex={1} align={"center"} justify={"center"}>
				<Stack spacing={4} w={"full"} maxW={"md"}>
					<Heading fontSize={"2xl"}>Влезте в акаунт</Heading>
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
									type={showPassword ? "text" : "password"}
									{...register("password", {
										required: "Паролата е задължителна",
									})}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() =>
											setShowPassword(
												(showPassword) => !showPassword
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
						<Stack spacing={6}>
							<Link
								as={RouterLink}
								to="/sign-up"
								fontSize="md"
								color={"blue.500"}
							>
								Регистрация
							</Link>
						</Stack>
						<Button
							mt={4}
							type="submit"
							colorScheme="blue"
							size="lg"
							fontSize="md"
							isLoading={isLoading}
							isDisabled={isSubmitting}
						>
							Влез
						</Button>
					</form>
				</Stack>
			</Flex>
		</Stack>
	);
}

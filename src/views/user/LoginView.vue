<!-- 使用 shadcn-vue 的登录页面-->
 <template>
    <div class="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div class="absolute inset-0 bg-zinc-900" />
            <div class="relative z-20 flex items-center text-lg font-medium">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2 h-6 w-6"
                >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
        </div>
    </div>
    </div>
    <div class="lg:p-8">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div class="flex flex-col space-y-2 text-center">
                <h1 class="text-2xl font-semibold tracking-tight">
                    创建一个新账户
                </h1>
                <p class="text-sm text-muted-foreground">
                    输入您的电子邮件以创建您的账户
                </p>
            </div>
            <UserAuthForm />
            <p class="px-8 text-center text-sm text-muted-foreground">
                通过点击继续，您同意我们的
                <a
                    href="/terms"
                    class="underline underline-offset-4 hover:text-primary"
                >
                    条款
                </a>
                和
                <a
                    href="/privacy"
                    class="underline underline-offset-4 hover:text-primary"></a>
            </p>
        </div>
    </div>
 </template>
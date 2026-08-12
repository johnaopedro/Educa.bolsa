import { test, expect } from '@playwright/test';

test('has title and can navigate to form', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Educa.bolsa/);

  // Localizar o botão de Começar Agora
  const startButton = page.getByRole('button', { name: /Começar Agora/i });
  await expect(startButton).toBeVisible();

  // Clicar e garantir que vai pra tela de simulação
  await startButton.click();
  await expect(page).toHaveURL(/.*simulacao/);
  
  // Garantir que a primeira pergunta aparece
  await expect(page.getByText(/Quanto você recebe de aposentadoria/i)).toBeVisible();
});

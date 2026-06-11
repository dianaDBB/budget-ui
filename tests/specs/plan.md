# Budget UI Test Plan

## Application Overview

The Budget UI (https://budget-ui-ht2i.onrender.com/) is a bank statement file conversion application. It converts CSV extracts from three banks — ActivoBank, Crédito Agrícola, and Crypto.com — into a standardised format. The UI offers two modes: Single File Conversion (one card per bank, each with its own file picker and Convert button) and Multiple File Conversion (a single card with three file pickers and a single Convert All button). All Convert/Convert All buttons are disabled until at least one file is selected. On success a file download is triggered and inputs are reset. On failure an error alert is shown inside the card. The Multiple File Conversion requires all three files to be provided for a successful conversion.

## Test Scenarios

### 1. Page Load and Layout

**Seed:** `tests/seed.spec.ts`

#### 1.1. should display the page header correctly

**File:** `tests/integration/page-load-header.spec.ts`

**Steps:**

1. Navigate to the Budget UI application and wait for network idle
   - expect: The page title is 'Budget UI - File Conversion'
   - expect: The heading 'Budget' is visible
   - expect: The subtitle 'Unify different bank extracts to a standardized format' is visible

#### 1.2. should display the welcome intro section

**File:** `tests/integration/page-load-intro.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
   - expect: The heading 'Welcome to Budget Application' is visible
   - expect: The description paragraph is visible

#### 1.3. should display the Multiple File Conversion section

**File:** `tests/integration/page-load-multi-section.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
   - expect: The section heading 'Convert Multiple Files' is visible
   - expect: The ActivoBank file area shows 'No file selected'
   - expect: The Crédito Agrícola file area shows 'No file selected'
   - expect: The Crypto.com file area shows 'No file selected'
   - expect: The 'Convert All' button is visible and disabled

#### 1.4. should display the Single File Conversion section with three bank cards

**File:** `tests/integration/page-load-single-section.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
   - expect: The section heading 'Single File Conversion' is visible
   - expect: The ActivoBank card shows 'Click to select file' and its 'Convert' button is disabled
   - expect: The Crédito Agrícola card shows 'Click to select file' and its 'Convert' button is disabled
   - expect: The Crypto.com card shows 'Click to select file' and its 'Convert' button is disabled

#### 1.5. should display the footer

**File:** `tests/integration/page-load-footer.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
   - expect: The footer text is visible

### 2. Single File Conversion - ActivoBank

**Seed:** `tests/seed.spec.ts`

#### 2.1. should have Convert button disabled before file selection

**File:** `tests/integration/single-activobank-disabled-state.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
   - expect: The 'Convert' button inside the ActivoBank card is disabled

#### 2.2. should enable Convert button after selecting a file

**File:** `tests/integration/single-activobank-file-selection.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/ActivoBank.xlsx` to the ActivoBank file input
   - expect: The file label changes to show 'ActivoBank.xlsx'
   - expect: The 'Convert' button in the ActivoBank card is now enabled

#### 2.3. should show success alert and reset inputs after successful conversion

**File:** `tests/integration/single-activobank-success.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/ActivoBank.xlsx` to the ActivoBank file input
   - expect: The file label does not show 'Click to select file'
3. Click the 'Convert' button and verify a file download is triggered
   - expect: A file download event occurs
   - expect: A success alert containing 'File converted successfully' appears inside the ActivoBank card
   - expect: The file label resets to 'Click to select file'
   - expect: The 'Convert' button becomes disabled again

#### 2.4. should show error alert when conversion fails with an invalid file

**File:** `tests/integration/single-activobank-error.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/ActivoBank-Invalid.xlsx` to the ActivoBank file input
3. Click the 'Convert' button in the ActivoBank card
   - expect: An error alert is shown inside the ActivoBank card

### 3. Single File Conversion - Crédito Agrícola

**Seed:** `tests/seed.spec.ts`

#### 3.1. should have Convert button disabled before file selection

**File:** `tests/integration/single-credito-agricola-disabled-state.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
   - expect: The 'Convert' button inside the Crédito Agrícola card is disabled

#### 3.2. should enable Convert button after selecting a file

**File:** `tests/integration/single-credito-agricola-file-selection.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/CreditoAgricola.xlsx` to the Crédito Agrícola file input
   - expect: The file label changes to show 'CreditoAgricola.xlsx'
   - expect: The 'Convert' button in the Crédito Agrícola card is now enabled

#### 3.3. should show success alert and reset inputs after successful conversion

**File:** `tests/integration/single-credito-agricola-success.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/CreditoAgricola.xlsx` to the Crédito Agrícola file input
   - expect: The file label does not show 'Click to select file'
3. Click the 'Convert' button and verify a file download is triggered
   - expect: A file download event occurs
   - expect: A success alert containing 'File converted successfully' appears inside the Crédito Agrícola card
   - expect: The file label resets to 'Click to select file'
   - expect: The 'Convert' button becomes disabled again

#### 3.4. should show error alert when conversion fails with an invalid file

**File:** `tests/integration/single-credito-agricola-error.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/CreditoAgricola-Invalid.xlsx` to the Crédito Agrícola file input
3. Click the 'Convert' button in the Crédito Agrícola card
   - expect: An error alert is shown inside the Crédito Agrícola card

### 4. Single File Conversion - Crypto.com

**Seed:** `tests/seed.spec.ts`

#### 4.1. should have Convert button disabled before file selection

**File:** `tests/integration/single-cryptocom-disabled-state.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
   - expect: The 'Convert' button inside the Crypto.com card is disabled

#### 4.2. should enable Convert button after selecting a file

**File:** `tests/integration/single-cryptocom-file-selection.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/CryptoCom.csv` to the Crypto.com file input
   - expect: The file label changes to show 'CryptoCom.csv'
   - expect: The 'Convert' button in the Crypto.com card is now enabled

#### 4.3. should show success alert and reset inputs after successful conversion

**File:** `tests/integration/single-cryptocom-success.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/CryptoCom.csv` to the Crypto.com file input
   - expect: The file label does not show 'Click to select file'
3. Click the 'Convert' button and verify a file download is triggered
   - expect: A file download event occurs
   - expect: A success alert containing 'File converted successfully' appears inside the Crypto.com card
   - expect: The file label resets to 'Click to select file'
   - expect: The 'Convert' button becomes disabled again

#### 4.4. should show error alert when conversion fails with an invalid file

**File:** `tests/integration/single-cryptocom-error.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/CryptoCom-Invalid.csv` to the Crypto.com file input
3. Click the 'Convert' button in the Crypto.com card
   - expect: An error alert is shown inside the Crypto.com card

### 5. Multiple File Conversion

**Seed:** `tests/seed.spec.ts`

> **Note:** The Multiple File Conversion requires all three bank files to be provided for a successful conversion.

#### 5.1. should have Convert All button disabled when no files are selected

**File:** `tests/integration/multi-converter-disabled-state.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
   - expect: All three file areas show 'No file selected'
   - expect: The 'Convert All' button is disabled

#### 5.2. should enable Convert All button when at least one file is selected

**File:** `tests/integration/multi-converter-file-selection.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/ActivoBank-Invalid.xlsx` to the ActivoBank input in the Multiple File Conversion card
   - expect: The ActivoBank file area shows 'ActivoBank-Invalid.xlsx'
   - expect: The Crédito Agrícola and Crypto.com areas still show 'No file selected'
   - expect: The 'Convert All' button is now enabled

#### 5.3. should show error when not all bank files are provided

**File:** `tests/e2e/multi-converter-convert-single-bank.spec.ts`

##### 5.3.1. should show error only "ActivoBank" file is provided

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/ActivoBank.xlsx` to the ActivoBank input only
   - expect: The ActivoBank file area shows the selected file name
3. Click the 'Convert All' button
   - expect: An error alert is shown because not all files were provided

##### 5.3.2. should show error only "Crédito Agrícola" file is provided

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/CreditoAgricola.xlsx` to the Crédito Agrícola input only
   - expect: The Crédito Agrícola file area shows the selected file name
3. Click the 'Convert All' button
   - expect: An error alert is shown because not all files were provided

##### 5.3.3. should show error only "CryptoCom" file is provided

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/CryptoCom.csv` to the Crypto.com input only
   - expect: The Crypto.com file area shows the selected file name
3. Click the 'Convert All' button
   - expect: An error alert is shown because not all files were provided

#### 5.4. should convert and download when all three bank files are provided

**File:** `tests/e2e/multi-converter-convert-all-banks.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/ActivoBank.xlsx` to the ActivoBank input in the Multiple File Conversion card
   - expect: The ActivoBank area shows the selected file name
3. Upload `tests/resources/CreditoAgricola.xlsx` to the Crédito Agrícola input in the Multiple File Conversion card
   - expect: The Crédito Agrícola area shows the selected file name
4. Upload `tests/resources/CryptoCom.csv` to the Crypto.com input in the Multiple File Conversion card
   - expect: The Crypto.com area shows the selected file name
   - expect: The 'Convert All' button is enabled
5. Click the 'Convert All' button and verify a file download is triggered
   - expect: A file download event occurs
   - expect: A success alert containing 'All files converted successfully' is shown
   - expect: All three file areas reset to 'No file selected'
   - expect: The 'Convert All' button becomes disabled again

#### 5.5. should show error alert when conversion fails with an invalid file

**File:** `tests/integration/multi-converter-error.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/ActivoBank-Invalid.xlsx` to the ActivoBank input in the Multiple File Conversion card
3. Upload `tests/resources/CreditoAgricola-Invalid.xlsx` to the Crédito Agrícola input
4. Upload `tests/resources/CryptoCom-Invalid.csv` to the Crypto.com input
5. Click the 'Convert All' button
   - expect: An error alert is shown inside the Multiple File Conversion card

#### 5.6. should not clear previously selected files after a failed conversion

**File:** `tests/integration/multi-converter-error-preserves-files.spec.ts`

**Steps:**

1. Navigate to the Budget UI application
2. Upload `tests/resources/ActivoBank-Invalid.xlsx` to the ActivoBank input
3. Upload `tests/resources/CreditoAgricola-Invalid.xlsx` to the Crédito Agrícola input
4. Upload `tests/resources/CryptoCom-Invalid.csv` to the Crypto.com input
5. Click the 'Convert All' button
   - expect: An error alert is shown
   - expect: The ActivoBank file area still shows the selected file name (not 'No file selected')
   - expect: The Crédito Agrícola file area still shows the selected file name (not 'No file selected')
   - expect: The Crypto.com file area still shows the selected file name (not 'No file selected')

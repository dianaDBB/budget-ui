# Budget UI Basic Operations Test Plan

## Application Overview

Plan for basic end-to-end validation of the Budget UI application, covering navigation, file conversion, rules management, file configuration, and cache clearing.

## Test Scenarios

### 1. Basic operations

**Seed:** `tests/seed.spec.ts`

#### 1.1. App loads and tabs are navigable

**File:** `tests/e2e/basic-operations.spec.ts`

**Steps:**

1. Open the application homepage

   - expect: The page title and header are visible.
   - expect: The default tab shows the Convert & Categorize view.

2. Switch through each top-level tab

   - expect: The Convert Multiple Files tab shows its upload and convert controls.
   - expect: The Rules tab shows a rules table with editable rows.
   - expect: The File Config tab shows bank configuration fields.
   - expect: The Cache Management tab shows a clear-cache action.

#### 1.2. Convert & Categorize generates a preview from an uploaded file

**File:** `tests/e2e/basic-operations.spec.ts`

**Steps:**

1. Open the Convert & Categorize tab

   - expect: The upload area for available banks is displayed.

2. Select a supported bank file and upload it

   - expect: The selected file name appears beside the chosen bank input.

3. Click Generate Preview

   - expect: A preview table is rendered with transaction rows.
   - expect: Any validation or API error message is shown clearly if the file is invalid.

4. Edit one preview row and add a new row

   - expect: The edited value is reflected in the table.
   - expect: The new row is inserted below the selected row.

5. Click Generate Excel File

   - expect: An Excel file download is triggered.
   - expect: A success message confirms the file was generated.

#### 1.3. Convert Multiple Files converts uploaded files

**File:** `tests/e2e/basic-operations.spec.ts`

**Steps:**

1. Open the Convert Multiple Files tab

   - expect: The page shows upload controls for the configured banks.

2. Select one or more files for available banks

   - expect: Each selected file appears as the chosen input.

3. Click Convert All

   - expect: A success message is shown and an Excel file download is triggered.
   - expect: The file inputs are reset for a fresh run.

#### 1.4. Rules can be added, edited, and saved

**File:** `tests/e2e/basic-operations.spec.ts`

**Steps:**

1. Open the Rules tab

   - expect: The rules table is visible and populated with existing rules.

2. Click Add Rule and fill in keyword, type, category, and subcategory

   - expect: A new editable row appears with the entered values.

3. Click Save Rules

   - expect: A success message confirms the rules were updated.
   - expect: The table refreshes without the temporary unsaved state.

#### 1.5. File configuration can be viewed and updated

**File:** `tests/e2e/basic-operations.spec.ts`

**Steps:**

1. Open the File Config tab

   - expect: The bank configuration form is visible for the first available bank.

2. Change one editable configuration field such as delimiter or date format

   - expect: The field value updates in the form.

3. Click Save Configuration

   - expect: A success or validation confirmation message is shown.
   - expect: The configuration remains available after a refresh if the change succeeds.

#### 1.6. Cache management clears the server-side cache

**File:** `tests/e2e/basic-operations.spec.ts`

**Steps:**

1. Open the Cache Management tab

   - expect: A Clear cache button and explanatory text are visible.

2. Click Clear cache

   - expect: A success message confirms the cache was cleared.
   - expect: An error message is shown if the action fails.

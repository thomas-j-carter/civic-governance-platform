# VALIDATION RULES

## PURPOSE

Define how the system validates itself during implementation.

---

## VALIDATION CHECKS

### 1. ARCHITECTURE VALIDATION

- Is layering respected?
- Are responsibilities separated?
- Are dependencies correct?

---

### 2. DOMAIN VALIDATION

- Are invariants enforced?
- Are transitions valid?
- Are states explicit?

---

### 3. DATA VALIDATION

- Are required fields enforced?
- Are relationships valid?
- Is referential integrity preserved?

---

### 4. AUTHORITY VALIDATION

- Are permissions enforced?
- Are grants checked?
- Is access secure?

---

### 5. AUDIT VALIDATION

- Does every mutation emit audit logs?
- Are logs complete?

---

### 6. IDEMPOTENCY VALIDATION

- Are write operations idempotent?
- Are duplicate executions prevented?

---

### 7. API VALIDATION

- Are endpoints consistent?
- Are DTOs correct?
- Are errors structured?

---

## REVIEW MODE

After each batch, AI must:

1. Run validation mentally
2. Identify violations
3. Fix them immediately

---

## OUTPUT REQUIREMENT

AI must produce:

- only valid code
- no known violations

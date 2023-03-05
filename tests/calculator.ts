import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Calculator } from "../target/types/calculator";
const { SystemProgram } = anchor.web3
import { expect } from 'chai';

describe("calculator", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Calculator as Program<Calculator>;
  const programProvider = program.provider as anchor.AnchorProvider;

  const calculatorPair = anchor.web3.Keypair.generate();

  const text = "Summer School Of Solana"

  it("Creating Calculator Instance", async () => {
    await program.methods.create(text).accounts(
      {
          calculator: calculatorPair.publicKey,
          user: programProvider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
      }
  ).signers([calculatorPair]).rpc()

    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.greeting).to.eql(text)
  });

  it('Addition',async () => {
    await program.methods.add(new anchor.BN(55), new anchor.BN(45))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(100))
  });

  it('Subtraction',async () => {
    await program.methods.subtract(new anchor.BN(50), new anchor.BN(10))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(40))
  });

  it('Multiplication',async () => {
    await program.methods.multiply(new anchor.BN(5), new anchor.BN(5))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(25))
  });

  it('Division',async () => {
    await program.methods.divide(new anchor.BN(100), new anchor.BN(5))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(20))
  });

  it('Power',async () => {
    await program.methods.power(new anchor.BN(10), 2)
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(100))
  });

});
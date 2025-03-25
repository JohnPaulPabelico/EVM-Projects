import {
  ApprovalForAll as ApprovalForAllEvent,
  MaxBadgesIncreased as MaxBadgesIncreasedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TokenConfigUpdated as TokenConfigUpdatedEvent,
  TokenConfigured as TokenConfiguredEvent,
  TokensBurned as TokensBurnedEvent,
  TokensMinted as TokensMintedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent
} from "../generated/Selyo-Base/Selyo-Base"
import {
  ApprovalForAll,
  MaxBadgesIncreased,
  OwnershipTransferred,
  TokenConfigUpdated,
  TokenConfigured,
  TokensBurned,
  TokensMinted,
  TransferBatch,
  TransferSingle,
  URI,
  AccountTokenBalance
} from "../generated/schema"
import { BigInt, store } from "@graphprotocol/graph-ts"

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMaxBadgesIncreased(event: MaxBadgesIncreasedEvent): void {
  let entity = new MaxBadgesIncreased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newMax = event.params.newMax

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenConfigUpdated(event: TokenConfigUpdatedEvent): void {
  let entity = new TokenConfigUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.newTokenURI = event.params.newTokenURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenConfigured(event: TokenConfiguredEvent): void {
  let entity = new TokenConfigured(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.tokenURI = event.params.tokenURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensBurned(event: TokensBurnedEvent): void {
  let entity = new TokensBurned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.tokenId = event.params.tokenId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensMinted(event: TokensMintedEvent): void {
  let entity = new TokensMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let entity = new TransferBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.ids = event.params.ids
  entity.values = event.params.values

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferSingle(event: TransferSingle): void {
  let tokenId = event.params.id;
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;

  // Update sender's balance
  if (from.toHexString() != "0x0000000000000000000000000000000000000000") {
    let senderBalanceId = from.toHexString() + "-" + tokenId.toString();
    let senderBalance = AccountTokenBalance.load(senderBalanceId);

    if (senderBalance == null) {
      senderBalance = new AccountTokenBalance(senderBalanceId);
      senderBalance.account = from;
      senderBalance.tokenId = tokenId;
      senderBalance.balance = BigInt.fromI32(0);
    }

    senderBalance.balance = senderBalance.balance.minus(value);
    if (senderBalance.balance.equals(BigInt.fromI32(0))) {
      store.remove("AccountTokenBalance", senderBalanceId);
    } else {
      senderBalance.save();
    }
  }

  // Update recipient's balance
  let recipientBalanceId = to.toHexString() + "-" + tokenId.toString();
  let recipientBalance = AccountTokenBalance.load(recipientBalanceId);

  if (recipientBalance == null) {
    recipientBalance = new AccountTokenBalance(recipientBalanceId);
    recipientBalance.account = to;
    recipientBalance.tokenId = tokenId;
    recipientBalance.balance = BigInt.fromI32(0);
  }

  recipientBalance.balance = recipientBalance.balance.plus(value);
  recipientBalance.save();
}

export function handleURI(event: URIEvent): void {
  let entity = new URI(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.value = event.params.value
  entity.internal_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

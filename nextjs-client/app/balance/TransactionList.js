'use client'
import { Table } from "@nextui-org/react";

export default function Transactionlist({ transactionList }){
    return (
      <div>
          <Table
          aria-label="Example table with static content"
          css={{
            height: "auto",
            minWidth: "100%",
          }}
        >
          <Table.Header>
            <Table.Column>날짜</Table.Column>
            <Table.Column>내용</Table.Column>
            <Table.Column>금액</Table.Column>
            <Table.Column>잔액</Table.Column>
          </Table.Header>
          <Table.Body>
            {transactionList.length > 0 &&
              transactionList.map((transaction, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{transaction.tran_date}</Table.Cell>
                    <Table.Cell>{transaction.print_content}</Table.Cell>
                    <Table.Cell>{transaction.tran_amt}</Table.Cell>
                    <Table.Cell>{transaction.after_balance_amt}</Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
          <Table.Pagination
          shadow
          noMargin
          align="center"
          rowsPerPage={10}
          onPageChange={(page) => console.log({ page })}
        />
        </Table>
        
    </div>
    )
}